import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getAkiradocsConfig } from '@/lib/getAkiradocsConfig';
import { validateConfig, getProviderConfig, isAzureProvider } from '@/lib/AIConfig';
import type { SupportedProvider } from '@/types/AkiraConfigType';

// Define block-specific system prompts
const blockPrompts = {
  paragraph: {
    system: "You are an expert content editor. Maintain paragraph structure and formatting. Output only the rewritten paragraph text without any markdown or HTML.",
    format: "Plain text paragraph"
  },
  heading: {
    system: "You are a headline optimization expert. Create impactful, concise headings. Output only the heading text without any formatting.",
    format: "Single line heading text"
  },
  code: {
    system: "You are an expert code optimizer. Maintain the exact programming language syntax and structure. Output only valid code without any explanations.",
    format: "Valid code in the original language"
  },
  list: {
    system: "You are a list organization expert. Maintain the list structure with one item per line. Do not include bullets or numbers.",
    format: "One item per line, no bullets/numbers"
  },
  blockquote: {
    system: "You are a quote refinement expert. Maintain the quote's core message and emotional impact. Output only the quote text.",
    format: "Single quote text without quotation marks"
  },
  callout: {
    system: "You are a technical documentation expert. Maintain the callout's type (info/warning/success/error) and structure. Output only the callout content.",
    format: "Callout content preserving type indicators"
  },
  image: {
    system: "You are an image description expert. Optimize image alt text and captions. Output in JSON format with alt and caption fields.",
    format: '{ "alt": "...", "caption": "..." }'
  }
};

// Provider-specific implementations
const providers = {
  openai: async (config: any, messages: any[]) => {
    const openai = new OpenAI({
      apiKey: config.apiKey || '',
    });

    const completion = await openai.chat.completions.create({
      model: config.model || 'gpt-4',
      temperature: config.temperature || 0.7,
      messages,
    });

    return completion.choices[0].message.content || '';
  },

  azure: async (config: any, messages: any[]) => {
    const openai = new OpenAI({
      apiKey: config.apiKey || '',
      baseURL: config.endpoint,
      defaultQuery: { 'api-version': '2024-02-15-preview' },
      defaultHeaders: { 'api-key': config.apiKey || '' },
    });

    const completion = await openai.chat.completions.create({
      model: config.deploymentName,
      temperature: config.temperature || 0.7,
      messages
    });

    return completion.choices[0].message.content || '';
  },

  anthropic: async (config: any, messages: any[]) => {
    const anthropic = new Anthropic({
      apiKey: config.apiKey || '',
    });

    // Convert messages format to Anthropic's format
    const systemMessage = messages.find(m => m.role === 'system')?.content || '';
    const userMessage = messages.find(m => m.role === 'user')?.content || '';

    const message = await anthropic.messages.create({
      model: config.model || 'claude-3-sonnet',
      max_tokens: 1024,
      temperature: config.temperature || 0.7,
      system: systemMessage,
      messages: [{ role: 'user', content: userMessage }],
    });

    return message.content[0].text;
  },

  google: async (config: any, messages: any[]) => {
    const genAI = new GoogleGenerativeAI(config.apiKey || '');
    const model = genAI.getGenerativeModel({ 
      model: config.model || 'gemini-pro',
    });

    // Convert messages format to Google's format
    const systemMessage = messages.find(m => m.role === 'system')?.content || '';
    const userMessage = messages.find(m => m.role === 'user')?.content || '';
    const prompt = `${systemMessage}\n\n${userMessage}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  },
};

export async function POST(request: Request) {
  try {
    validateConfig();
    const config = getProviderConfig();
    const akiraConfig = getAkiradocsConfig();
    const provider = akiraConfig.rewrite?.provider || 'openai';

    const { content, blockType, style } = await request.json();

    if (!content || !blockType || !style) {
      return NextResponse.json(
        { error: 'Missing required fields: content, blockType, or style' },
        { status: 400 }
      );
    }

    const blockPrompt = blockPrompts[blockType as keyof typeof blockPrompts];
    if (!blockPrompt) {
      return NextResponse.json(
        { error: 'Invalid block type' },
        { status: 400 }
      );
    }

    const messages = [
      {
        role: "system",
        content: `${blockPrompt.system}\n\nExpected output format: ${blockPrompt.format}\n\nDo not include any explanations or markdown formatting in the response.`
      },
      {
        role: "user",
        content: `Rewrite the following ${blockType} content in a ${style} style while maintaining its structure:\n\n${content}`
      }
    ];

    const providerImpl = providers[provider as SupportedProvider];
    if (!providerImpl) {
      return NextResponse.json(
        { error: `Unsupported AI provider: ${provider}` },
        { status: 400 }
      );
    }

    try {
      const rewrittenContent = await providerImpl(config, messages);
      return NextResponse.json({ content: rewrittenContent });
    } catch (providerError: any) {
      console.error('Provider API error:', providerError);
      return NextResponse.json(
        { 
          error: providerError.message || 'Provider API error',
          details: providerError.response?.data || providerError.response || providerError
        },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('AI API error:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: error.message,
          details: error
        },
        { status: error.message.includes('API key') ? 400 : 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate AI content', details: error },
      { status: 500 }
    );
  }
}