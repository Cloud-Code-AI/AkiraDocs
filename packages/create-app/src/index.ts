import cac from 'cac';
import chalk from 'chalk';
import { mkdir, readFile, copyFile, readdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import ora from 'ora';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function readJson(filePath: string) {
  const content = await readFile(filePath, 'utf-8');
  return JSON.parse(content);
}

// Helper function for recursive directory copying
async function copyDir(src: string, dest: string) {
  await mkdir(dest, { recursive: true });
  const entries = await readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await copyFile(srcPath, destPath);
    }
  }
}

async function main() {
  const packageJsonPath = path.resolve(__dirname, '../package.json');
  const packageJson = await readJson(packageJsonPath);

  const cli = cac('create-akiradocs');

  cli
    .command('[directory]', 'Create a new Akira Docs site')
    .action(async (directory: string = '.') => {
      const spinner = ora('Creating project...').start();

      try {
        const targetDir = path.resolve(directory);

        // Create directory if it doesn't exist
        await mkdir(targetDir, { recursive: true });

        // Copy template files
        const templateDir = path.join(__dirname, '../template');
        await copyDir(templateDir, targetDir);

        spinner.succeed(chalk.green('Project created successfully!'));

        console.log('\nNext steps:');
        console.log(chalk.cyan(`  cd ${directory}`));
        console.log(chalk.cyan('  npm install'));
        console.log(chalk.cyan('  npm run dev'));
      } catch (error) {
        spinner.fail(chalk.red('Failed to create project'));
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
