import { readFile, writeFile, mkdir, rm, cp } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function readJson(filePath: string) {
  const content = await readFile(filePath, 'utf-8')
  return JSON.parse(content)
}

async function writeJson(filePath: string, data: any) {
  await writeFile(filePath, JSON.stringify(data, null, 2) + '\n')
}

async function prepareTemplate() {
  const templateDir = path.join(__dirname, '../template')
  const sourceTemplateDir = path.join(__dirname, '../src/templates/default')

  // Clean up existing template directory if it exists
  try {
    await rm(templateDir, { recursive: true, force: true })
  } catch (err) {
    // Ignore if directory doesn't exist
  }

  // Create template directory
  await mkdir(templateDir, { recursive: true })

  // Copy all files from source template directory to template directory
  await cp(sourceTemplateDir, templateDir, { recursive: true })

//   // Create template package.json with necessary fields
//   const templatePkg = {
//     name: 'my-akira-docs',
//     version: '0.0.0',
//     private: true,
//     scripts: {
//       dev: 'next dev',
//       build: 'next build',
//       start: 'next start',
//       lint: 'next lint'
//     },
//     dependencies: {
//       // Add your template dependencies here
//     },
//     devDependencies: {
//       // Add your template devDependencies here
//     }
//   }

//   // Write template package.json
//   await writeJson(path.join(templateDir, 'package.json'), templatePkg)

  console.log('Template prepared successfully')
}

prepareTemplate().catch((err) => {
  console.error('Error preparing template:', err)
  process.exit(1)
})