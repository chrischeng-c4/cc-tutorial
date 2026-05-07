#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..')

const demos = {
  'prd-draft': {
    caseId: '04',
    title: 'PRD 初稿產生與審查',
    input: [
      'demo-data/fixtures/prd-template.md',
      'demo-data/fixtures/feature-brief-order-export.md',
    ],
    prompt: 'demo-data/prompts/prd-draft.md',
    expected: 'demo-data/expected/prd-draft.md',
  },
  'technical-questions': {
    caseId: '13',
    title: 'PRD 初版 + Codebase 轉技術可行性問題清單',
    input: [
      'demo-data/fixtures/codebase-prd.md',
      'demo-data/demo-repo/README.md',
      'demo-data/demo-repo/src/orders/exportCsv.js',
      'demo-data/demo-repo/src/orders/orderRepository.js',
      'demo-data/demo-repo/src/auth/permissions.js',
      'demo-data/demo-repo/src/audit/auditLog.js',
    ],
    prompt: 'demo-data/prompts/technical-questions.md',
    expected: 'demo-data/expected/technical-questions.md',
  },
  'meeting-actions': {
    caseId: '03',
    title: '會議紀錄轉 Action Items',
    input: ['demo-data/fixtures/meeting-notes.md'],
    prompt: 'demo-data/prompts/meeting-actions.md',
    expected: 'demo-data/expected/action-items.md',
  },
  'prd-update': {
    caseId: '12',
    title: '微調功能開發後回補 PRD 草稿',
    input: [
      'demo-data/demo-repo/src/orders/exportCsv.js',
      'demo-data/demo-repo/src/auth/permissions.js',
      'demo-data/fixtures/codebase-prd.md',
    ],
    prompt: 'demo-data/prompts/prd-update.md',
    expected: 'demo-data/expected/prd-update.md',
  },
  'jira-subtasks': {
    caseId: '02',
    title: 'JIRA Epic 建立 Sub-tasks 草稿',
    input: ['demo-data/fixtures/jira-epic.json'],
    prompt: 'demo-data/prompts/jira-subtasks.md',
    expected: 'demo-data/expected/jira-subtasks-dry-run.json',
  },
  'build-validator': {
    caseId: '14',
    title: '打造自己的 CLI：JIRA bulk JSON 驗證器',
    input: ['demo-data/expected/jira-subtasks-dry-run.json'],
    prompt: 'demo-data/prompts/build-validator.md',
    expected: 'demo-data/expected/build-validator.mjs',
  },
}

function usage() {
  console.log(`Usage:
  npm run demo:list
  npm run demo:case -- <case>
  npm run demo:case -- all

Cases:
${Object.entries(demos).map(([name, demo]) => `  ${name.padEnd(20)} Case ${demo.caseId} · ${demo.title}`).join('\n')}`)
}

async function readText(relativePath) {
  return readFile(path.join(repoRoot, relativePath), 'utf8')
}

function printFileList(label, files) {
  console.log(`\n${label}`)
  files.forEach(file => console.log(`  - ${file}`))
}

async function printDemo(name) {
  const demo = demos[name]
  if (!demo) {
    console.error(`Unknown demo case: ${name}\n`)
    usage()
    process.exitCode = 1
    return
  }

  console.log(`\n# Case ${demo.caseId}: ${demo.title}`)
  console.log(`\nCommand: npm run demo:case -- ${name}`)
  printFileList('Input fixtures:', demo.input)
  printFileList('Prompt:', [demo.prompt])
  printFileList('Fallback output:', [demo.expected])

  console.log('\n--- Prompt ---')
  console.log((await readText(demo.prompt)).trim())

  console.log('\n--- Deterministic fallback output ---')
  console.log((await readText(demo.expected)).trim())
}

async function main() {
  const command = process.argv[2] ?? 'list'

  if (command === 'list' || command === '--help' || command === '-h') {
    usage()
    return
  }

  if (command === 'all') {
    for (const name of Object.keys(demos)) {
      await printDemo(name)
    }
    return
  }

  await printDemo(command)
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
