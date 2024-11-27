import cac from 'cac';
import chalk from 'chalk';
import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import ora from 'ora';
import enquirer from 'enquirer';
import { updateDir } from '../scripts/updateTemplate';
import { copyDir } from '../scripts/copyTemplate';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ConfigAnswers {
  siteTitle: string;
  siteDescription: string;
  companyName: string;
  githubUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
  googleAnalyticsId?: string;
  enableAnalytics: boolean;
  enableAutoTranslate: boolean;
}

async function promptConfigQuestions() {
  const response = await enquirer.prompt<ConfigAnswers>([
    {
      type: 'input',
      name: 'siteTitle',
      message: 'What is your site title?',
      initial: 'My Documentation',
    },
    {
      type: 'input',
      name: 'siteDescription',
      message: 'Enter a brief description of your site:',
      initial: 'Documentation powered by Akira Docs',
    },
    {
      type: 'input',
      name: 'companyName',
      message: 'What is your company name?',
      initial: 'My Company',
    },
    {
      type: 'input',
      name: 'githubUrl',
      message: 'Enter your GitHub repository URL (optional):',
      initial: '',
    },
    {
      type: 'input',
      name: 'twitterUrl',
      message: 'Enter your Twitter/X profile URL (optional):',
      initial: '',
    },
    {
      type: 'input',
      name: 'linkedinUrl',
      message: 'Enter your LinkedIn company URL (optional):',
      initial: '',
    },
    {
      type: 'confirm',
      name: 'enableAnalytics',
      message: 'Would you like to enable Google Analytics?',
      initial: false,
    },
    {
      type: 'input',
      name: 'googleAnalyticsId',
      message: 'Enter your Google Analytics Measurement ID:',
      initial: '',
      skip: (answers: Partial<ConfigAnswers>) => !answers.enableAnalytics,
    },
    {
      type: 'confirm',
      name: 'enableAutoTranslate',
      message: 'Would you like to enable automatic translation of content?',
      initial: true,
    },
  ]);

  return response;
}

async function updateConfig(targetDir: string, answers: ConfigAnswers) {
  const configPath = path.join(targetDir, 'akiradocs.config.json');
  const config = JSON.parse(await readFile(configPath, 'utf-8'));

  config.site.title = answers.siteTitle;
  config.site.description = answers.siteDescription;
  config.footer.companyName = answers.companyName;

  config.footer.socialLinks = [
    ...(answers.githubUrl ? [{
      name: 'GitHub',
      url: answers.githubUrl,
      icon: '/github.svg'
    }] : []),
    ...(answers.twitterUrl ? [{
      name: 'Twitter',
      url: answers.twitterUrl,
      icon: '/twitter.svg'
    }] : []),
    ...(answers.linkedinUrl ? [{
      name: 'LinkedIn',
      url: answers.linkedinUrl,
      icon: '/linkedin.svg'
    }] : [])
  ];

  config.analytics.google.enabled = answers.enableAnalytics;
  if (answers.enableAnalytics) {
    config.analytics.google.measurementId = answers.googleAnalyticsId;
  }

  config.translation.auto_translate = answers.enableAutoTranslate;

  await writeFile(configPath, JSON.stringify(config, null, 2));
}

async function readJson(filePath: string) {
  const content = await readFile(filePath, 'utf-8');
  return JSON.parse(content);
}

async function updateEditorDependencies(targetDir: string) {
  const pkgJsonPath = path.join(targetDir, 'editor/package.json');
  const pkgJson = JSON.parse(await readFile(pkgJsonPath, 'utf-8'));
  
  // Ensure required dependencies are present
  pkgJson.dependencies = {
    ...pkgJson.dependencies,
    "openai": "^4.73.1",
    "next": "15.0.3",
    "sonner": "^1.7.0",
  };

  await writeFile(pkgJsonPath, JSON.stringify(pkgJson, null, 2));
}

async function main() {
  const packageJsonPath = path.resolve(__dirname, '../package.json');
  const packageJson = await readJson(packageJsonPath);

  const cli = cac('create-akiradocs');

  cli
    .command('[directory]', 'Create a new Akira Docs site')
    .action(async (directory: string = '.') => {
      try {
        const editorResponse = await enquirer.prompt<{ includeEditor: boolean }>({
          type: 'confirm',
          name: 'includeEditor',
          message: 'Would you like to include the local editor? (Recommended for development)',
          initial: true,
        });

        const configAnswers = await promptConfigQuestions();

        const spinner = ora('Creating project...').start();

        const targetDir = path.resolve(directory);
        await mkdir(targetDir, { recursive: true });

        await copyDir(path.join(__dirname, '../template'), targetDir);
        await updateConfig(targetDir, configAnswers);

        if (editorResponse.includeEditor) {
          const editorDir = path.join(__dirname, '../../editor');
          const targetEditorDir = path.join(targetDir, 'editor');
          await copyDir(editorDir, targetEditorDir);

          await updateEditorDependencies(targetDir);

          const pkgJsonPath = path.join(targetDir, 'package.json');
          const pkgJson = JSON.parse(await readFile(pkgJsonPath, 'utf-8'));
          pkgJson.scripts = {
            ...pkgJson.scripts,
            'dev:editor': 'cd editor && npm run dev',
            'dev:docs': 'npm run dev',
            'dev:all': 'concurrently "npm run dev:docs" "npm run dev:editor"',
          };
          pkgJson.devDependencies = {
            ...pkgJson.devDependencies,
            'concurrently': '^8.0.0',
          };
          await writeFile(pkgJsonPath, JSON.stringify(pkgJson, null, 2));
        }

        spinner.succeed(chalk.green('Project created successfully!'));

        console.log('\nNext steps:');
        console.log(chalk.cyan(`  cd ${directory}`));
        console.log(chalk.cyan('  npm install'));
        if (editorResponse.includeEditor) {
          console.log(chalk.cyan('  cd editor && npm install'));
          console.log(chalk.cyan('  cd .. && npm run dev:all'));
          console.log('\nEditor will be available at: http://localhost:3001');
          console.log('Documentation site will be at: http://localhost:3000');
        } else {
          console.log(chalk.cyan('  npm run dev'));
        }

        console.log('\nNote: You can update your site configuration anytime by editing akiradocs.config.json');
      } catch (error) {
        console.error(chalk.red('Failed to create project'));
        console.error(error);
        process.exit(1);
      }
    });

  cli
    .command('update', 'Update an existing Akira Docs site')
    .action(async () => {
      const spinner = ora('Updating project...').start();

      try {
        const templateDir = path.join(__dirname, '../template');
        await updateDir(templateDir, '.');

        spinner.succeed(chalk.green('Project updated successfully!'));
        console.log('\nNext steps:');
        console.log(chalk.cyan('  npm install'));
        console.log(chalk.cyan('  npm run dev'));
      } catch (error) {
        spinner.fail(chalk.red('Failed to update project'));
        console.error(error);
        process.exit(1);
      }
    });

  cli.help();
  cli.version(packageJson.version);
  cli.parse(process.argv, { run: false });
  await cli.runMatchedCommand();
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
