#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import process from 'node:process'

const REQUIRED_TOP = ['dryRun', 'sourceEpic', 'wouldCreate']
const REQUIRED_TASK = ['summary', 'type']

function usage() {
  process.stderr.write('用法：node scripts/validate-jira-bulk.mjs <path/to/dry-run.json>\n')
}

async function loadJson(file) {
  const raw = await readFile(file, 'utf8')
  return JSON.parse(raw)
}

function validate(data) {
  const errors = []

  for (const key of REQUIRED_TOP) {
    if (!(key in data)) errors.push(`缺少必要欄位：${key}`)
  }

  if (data.dryRun !== true) {
    errors.push(`dryRun 必須嚴格為 true，目前為 ${JSON.stringify(data.dryRun)}`)
  }

  if (typeof data.sourceEpic !== 'string' || data.sourceEpic.trim() === '') {
    errors.push('sourceEpic 必須是非空字串')
  }

  if (!Array.isArray(data.wouldCreate)) {
    errors.push('wouldCreate 必須是 array')
  } else {
    data.wouldCreate.forEach((task, i) => {
      for (const key of REQUIRED_TASK) {
        const value = task?.[key]
        if (typeof value !== 'string' || value.trim() === '') {
          errors.push(`wouldCreate[${i}] 缺少或不是非空字串：${key}`)
        }
      }
    })
  }

  return errors
}

async function main() {
  const file = process.argv[2]
  if (!file) {
    usage()
    process.exit(2)
  }

  let data
  try {
    data = await loadJson(file)
  } catch (e) {
    process.stderr.write(`[ERROR] 無法讀取或解析 JSON：${e.message}\n`)
    process.exit(1)
  }

  const errors = validate(data)
  const taskCount = Array.isArray(data?.wouldCreate) ? data.wouldCreate.length : 0

  process.stdout.write(`# 驗證報告：${file}\n`)
  process.stdout.write(`Tasks: ${taskCount}\n`)
  process.stdout.write(`Errors: ${errors.length}\n`)

  if (errors.length > 0) {
    process.stdout.write('\n')
    for (const err of errors) process.stdout.write(`  - ${err}\n`)
    process.exit(1)
  }

  process.stdout.write('OK\n')
  process.exit(0)
}

main()
