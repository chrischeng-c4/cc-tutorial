# Coding Agent Tutorial

Course site and demo fixtures for the Claude Code + Codex workshop.

## Classroom Demo Flow

For live classroom demos, students usually only need:

```bash
git clone https://github.com/chrischeng-c4/cc-tutorial.git
cd cc-tutorial
claude   # or codex
```

Then paste the prompt shown on the course page. The first prompt can ask the agent to verify that the referenced `demo-data/` prompt and fixture files exist before it runs the task.

## Fallback Demo CLI

Detailed classroom steps are in:

```text
demo-data/RUNBOOK.md
```

The classroom-safe demo CLI lives at:

```text
scripts/demo-cli.mjs
```

It uses only local files under `demo-data/` and Node built-ins. It does not call an LLM, MCP server, JIRA, Google Docs, Figma, or any external API.

The demo CLI is for fallback output and instructor prep, not the primary student flow:

```bash
npm run demo:list
npm run demo:case -- prd-draft
npm run demo:case -- technical-questions
npm run demo:case -- meeting-actions
npm run demo:case -- prd-update
npm run demo:case -- jira-subtasks
npm run demo:case -- build-validator
```

`npm run demo:list` runs the local helper defined in `package.json`. It only lists available demo cases and verifies that Node can execute the helper; it does not call an LLM, MCP server, JIRA, Google Docs, or any external API.

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
4. `prd-update` - Case 12, code change backfill into PRD.
5. `jira-subtasks` - Case 02, dry-run JIRA subtasks.
6. `build-validator` - Case 14, build a local validator script.

## Run Course Site

Install dependencies only if you want to run the website locally:

```bash
npm install
npm run dev
```

Then open the Vite URL and go to `#/coding-agent`.

## Verify

```bash
npm run demo:list
npm run demo:case -- all
npm run build
npm run lint
```
