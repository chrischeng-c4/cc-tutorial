# Coding Agent Tutorial

Course site and demo fixtures for the Claude Code + Codex workshop.

## Run Demo CLI

Detailed classroom steps are in:

```text
demo-data/RUNBOOK.md
```

The classroom-safe demo CLI lives at:

```text
scripts/demo-cli.mjs
```

It uses only local files under `demo-data/` and Node built-ins. It does not call an LLM, MCP server, JIRA, Google Docs, Figma, or any external API.

After cloning the repo:

```bash
npm run demo:list
npm run demo:case -- prd-draft
npm run demo:case -- technical-questions
npm run demo:case -- meeting-actions
npm run demo:case -- jira-subtasks
```

You can also run all fallback outputs:

```bash
npm run demo:case -- all
```

## Demo Files

```text
demo-data/
  fixtures/      # Input data students can inspect or ask an agent to read
  prompts/       # Exact prompts for each classroom demo
  expected/      # Deterministic fallback outputs
  demo-repo/     # Tiny codebase for the PRD + codebase feasibility demo
```

Recommended classroom order:

1. `prd-draft` - Case 04, PRD draft and review.
2. `technical-questions` - Case 13, PRD + codebase to facts / assumptions / HITL questions.
3. `meeting-actions` - Case 03, meeting notes to action items.
4. `jira-subtasks` - Case 02, dry-run JIRA subtasks.

## Run Course Site

Install dependencies only if you want to run the website locally:

```bash
npm install
npm run dev
```

Then open the Vite URL and go to `#/demo-checklist`.

## Verify

```bash
npm run demo:list
npm run demo:case -- all
npm run build
npm run lint
```
