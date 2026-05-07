# Demo Data

This folder is the classroom-safe fallback for the live demo cases.

For full classroom steps, read:

```text
demo-data/RUNBOOK.md
```

Use the fixtures for live agent prompts. If an MCP server, OAuth flow, or external API fails during class, run the CLI fallback:

```bash
npm run demo:list
npm run demo:case -- prd-draft
npm run demo:case -- technical-questions
npm run demo:case -- meeting-actions
npm run demo:case -- jira-subtasks
```

The CLI does not call an LLM. It prints the exact prompt and deterministic expected output so the instructor can keep the lesson moving.
