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

async function readJson(filePath: string) {
  const content = await readFile(filePath, 'utf-8');
  return JSON.parse(content);
}

async function main() {
  const packageJsonPath = path.resolve(__dirname, '../package.json');
  const packageJson = await readJson(packageJsonPath);

  const cli = cac('create-akiradocs');

  cli
    .command('[directory]', 'Create a new Akira Docs site')
    .action(async (directory: string = '.') => {
      const response = await enquirer.prompt<{ includeEditor: boolean }>({
        type: 'confirm',
        name: 'includeEditor',
        message: 'Would you like to include the local editor? (Recommended for development)',
        initial: true,
      });

      const spinner = ora('Creating project...').start();

      try {
        const targetDir = path.resolve(directory);
        await mkdir(targetDir, { recursive: true });

        // Copy main template files
        const templateDir = path.join(__dirname, '../template');
        await copyDir(templateDir, targetDir);

        // Copy editor if selected
        if (response.includeEditor) {
          const editorDir = path.join(__dirname, '../../editor');
          const targetEditorDir = path.join(targetDir, 'editor');
          await copyDir(editorDir, targetEditorDir);

          // Update package.json to include editor scripts
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
        if (response.includeEditor) {
          console.log(chalk.cyan('  cd editor && npm install'));
          console.log(chalk.cyan('  cd .. && npm run dev:all'));
          console.log('\nEditor will be available at: http://localhost:3001');
          console.log('Documentation site will be at: http://localhost:3000');
        } else {
          console.log(chalk.cyan('  npm run dev'));
        }
      } catch (error) {
        spinner.fail(chalk.red('Failed to create project'));
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
