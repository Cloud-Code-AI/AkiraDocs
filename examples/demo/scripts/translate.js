const { anthropic } = require('@ai-sdk/anthropic');
const { generateText } = require('ai');
const fs = require('fs/promises');
const path = require('path');
const dotenv = require('dotenv');
const { glob } = require('glob');
const { EventEmitter } = require('events');

dotenv.config();

class TranslationService extends EventEmitter {
  constructor(config) {
    super();
    if (!config?.provider) {
      throw new Error('Translation provider not specified in config');
    }

    this.config = config;
    this.provider = config.provider;
    this.model = config.model || 'claude-3-sonnet-20240229';

    if (!checkApiKeys({ translation: config })) {
      throw new Error('Missing required API keys for translation');
    }

    this.stats = {
      totalFiles: 0,
      totalTokens: { input: 0, output: 0 },
      totalCost: 0,
      filename: '',
      modelPricing: {
        'claude-3-sonnet-20240229': {
          input: 0.0015,
          output: 0.003,
        },
        // Add other model pricing as needed
      }
    };
  }

  estimateTokens(text) {
    // Rough estimate - replace with more accurate tokenizer if needed
    return Math.ceil(text.length / 4);
  }

  calculateCost(inputTokens, outputTokens) {
    const pricing = this.stats.modelPricing[this.model];
    if (!pricing) {
      console.warn(`No pricing found for model ${this.model}`);
      return 0;
    }
    
    return ((inputTokens * pricing.input) + (outputTokens * pricing.output)) / 1000;
  }

  async translateText(text, targetLanguage) {
    if (this.provider === 'azure') {
      return this.translateAzure(text, targetLanguage);
    }
    return this.translateLLM(text, targetLanguage);
  }

  async translateLLM(text, targetLanguage, filename = '') {
    try {
      const prompt = `Translate the following text to ${targetLanguage}. Maintain the original formatting and only output the translation:\n\n${text}`;
      const inputTokens = this.estimateTokens(prompt);

      const result = await generateText({
        model: anthropic(this.model, {
          cacheControl: true,
        }),
        messages: [
          {
            role: 'user',
            content: [{ type: 'text', text: prompt }],
          },
        ],
      });

      const outputTokens = this.estimateTokens(result.text);
      const cost = this.calculateCost(inputTokens, outputTokens);

      // Update stats
      this.stats.totalTokens.input += inputTokens;
      this.stats.totalTokens.output += outputTokens;
      this.stats.totalCost += cost;
      this.stats.filename = filename;

      this.emit('translation', { inputTokens, outputTokens, cost, filename });

      return result.text.trim();
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  }

  async translateAzure(text, targetLanguage) {
    const endpoint = 'https://api.cognitive.microsofttranslator.com';
    const location = process.env.AZURE_LOCATION || 'eastus';

    try {
      const response = await fetch(`${endpoint}/translate`, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': process.env.AZURE_API_KEY,
          'Ocp-Apim-Subscription-Region': location,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([{ text }]),
        params: {
          'api-version': '3.0',
          'from': 'en',
          'to': targetLanguage
        }
      });

      if (response.ok) {
        const result = await response.json();
        return result[0].translations[0].text;
      }
      return text;
    } catch (error) {
      console.error('Azure translation error:', error);
      return text;
    }
  }
}

class DocumentTranslator {
  constructor(configPath) {
    this.config = require(configPath);
    this.translationService = new TranslationService(this.config.translation);

    this.stats = {
      filesProcessed: 0,
      startTime: null,
      endTime: null,
      filename: '',
    };

    // Listen to translation events
    this.translationService.on('translation', (stats) => {
      console.log(`[${stats.filename}] Translation stats - Input tokens: ${stats.inputTokens}, Output tokens: ${stats.outputTokens}, Cost: $${stats.cost.toFixed(4)}`);
    });
  }

  async translateContent(content, targetLanguage, filename) {
    const translated = { ...content };

    if (translated.title) {
      translated.title = await this.translationService.translateText(
        translated.title,
        targetLanguage,
        filename
      );
    }

    if (translated.description) {
      translated.description = await this.translationService.translateText(
        translated.description,
        targetLanguage,
        filename
      );
    }

    if (translated.blocks) {
      for (const block of translated.blocks) {
        if (block.content) {
          if (typeof block.content === 'string') {
            block.content = await this.translationService.translateText(
              block.content,
              targetLanguage,
              filename
            );
          } else if (Array.isArray(block.content)) {
            block.content = await Promise.all(
              block.content.map(item => 
                this.translationService.translateText(item, targetLanguage, filename)
              )
            );
          }
        }
      }
    }

    return translated;
  }

  async translateMetaTitle(title, targetLanguage, filename) {
    const prompt = `Translate this navigation menu title to ${targetLanguage}. Keep it concise and simple, using common terms as this will be part of sidebar navigation. Title: "${title}"`;
    return this.translationService.translateText(prompt, targetLanguage, filename);
  }

  async translateMetaJson(content, targetLanguage, filename) {
    const translated = { ...content };
    
    // Preserve non-translatable fields
    if (translated.defaultRoute) {
      return translated;
    }

    // Translate title if present at root level
    if (translated.title) {
      translated.title = await this.translateMetaTitle(
        translated.title,
        targetLanguage,
        filename
      );
    }

    // Recursively translate nested items
    for (const key in translated) {
      if (typeof translated[key] === 'object') {
        // Translate the key's title if it exists
        if (translated[key].title) {
          translated[key].title = await this.translateMetaTitle(
            translated[key].title,
            targetLanguage,
            filename
          );
        }
        
        // Handle nested items recursively
        if (translated[key].items) {
          const translatedItems = {};
          
          for (const itemKey in translated[key].items) {
            const item = translated[key].items[itemKey];
            if (item.title) {
              translatedItems[itemKey] = {
                ...item,
                title: await this.translateMetaTitle(
                  item.title,
                  targetLanguage,
                  filename
                )
              };
            } else {
              translatedItems[itemKey] = item;
            }
          }
          
          translated[key].items = translatedItems;
        }
      }
    }

    return translated;
  }

  async processDirectory(sourceDir) {
    this.stats.startTime = new Date();
    const { targetLanguages, excludedPaths } = this.config.translation;
    const files = await glob(path.join(sourceDir, '**/*.json'));

    for (const file of files) {
      // Only process files from the English source
      if (excludedPaths.some(excluded => file.includes(excluded)) || 
          !file.includes('/en/')) {
        continue;
      }

      this.stats.filesProcessed++;
      const filename = path.basename(file);
      console.log(`Processing ${filename}`);
      
      try {
        const content = JSON.parse(await fs.readFile(file, 'utf-8'));

        for (const lang of targetLanguages) {
          // Create the target directory path
          const targetDir = file.replace('/en/', `/${lang}/`);
          await fs.mkdir(path.dirname(targetDir), { recursive: true });

          let translated;
          if (filename === '_meta.json') {
            translated = await this.translateMetaJson(content, lang, filename);
          } else {
            translated = await this.translateContent(content, lang, filename);
          }

          // Write the translated file
          await fs.writeFile(
            targetDir, 
            JSON.stringify(translated, null, 2)
          );

          console.log(`Translated to ${lang}: ${filename}`);
        }
      } catch (error) {
        console.error(`Error processing ${filename}:`, error);
        continue;
      }
    }

    this.stats.endTime = new Date();
    this.printStats();
  }

  printStats() {
    const duration = (this.stats.endTime - this.stats.startTime) / 1000;
    console.log('\n=== Translation Statistics ===');
    console.log(`Files Processed: ${this.stats.filesProcessed}`);
    console.log(`Total Input Tokens: ${this.translationService.stats.totalTokens.input}`);
    console.log(`Total Output Tokens: ${this.translationService.stats.totalTokens.output}`);
    console.log(`Total Cost: $${this.translationService.stats.totalCost.toFixed(4)}`);
    console.log(`Duration: ${duration.toFixed(2)} seconds`);
    console.log('=========================\n');
  }
}

const checkApiKeys = (config) => {
  if (!config.translation?.auto_translate) {
    console.log('Auto-translation is disabled in config. Skipping translation.');
    return false;
  }

  const provider = config.translation?.provider;
  if (!provider) {
    console.error('Translation provider not specified in config');
    return false;
  }

  const requiredKeys = {
    anthropic: ['ANTHROPIC_API_KEY'],
    azure: ['AZURE_API_KEY', 'AZURE_LOCATION']
  };

  const keys = requiredKeys[provider];
  if (!keys) {
    console.error(`Unsupported translation provider: ${provider}`);
    return false;
  }

  const missingKeys = keys.filter(key => !process.env[key]);
  if (missingKeys.length > 0) {
    console.error(`Missing required API keys for ${provider}: ${missingKeys.join(', ')}`);
    console.error('Please add them to your .env file');
    return false;
  }

  return true;
};

async function translate() {
  const configPath = path.join(process.cwd(), 'akiradocs.config.json');
  const config = require(configPath);

  if (!checkApiKeys(config)) {
    process.exit(1);
  }

  const translator = new DocumentTranslator(configPath);
  await translator.processDirectory('compiled');
}

if (require.main === module) {
  translate().catch(console.error);
}

module.exports = { translate }; 