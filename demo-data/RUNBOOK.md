# Demo Runbook

這份 runbook 是給上課現場和學生課後自練用的。目標是：學生 clone repo 後，可以照著 prompt 跑 demo；如果 agent、MCP、OAuth 或網路卡住，也可以用 CLI fallback 看固定輸出。

## 0. Clone 後先確認

```bash
git clone https://github.com/chrischeng-c4/cc-tutorial.git
cd cc-tutorial
```

課堂主流程是進 repo 後直接開 `claude` 或 `codex`，再貼各 case 的 prompt。
`npm run demo:list` 是講師備課與 fallback 自檢用，不是學生上課第一步。若要跑網站才需要：

```bash
npm install
npm run dev
```

## 1. 課堂操作模式

每個 demo 都有兩種路徑：

1. Agent path：把 prompt 貼給 Claude Code / Codex，請它讀 `demo-data/` 裡的指定檔案。
2. CLI fallback：如果 agent 或外部工具卡住，跑 `npm run demo:case -- <case>` 顯示固定輸出。

課堂主路徑只讀本機 fixture，不依賴 Google / JIRA / Figma / MCP。那些工具可以加演，但不應該是 demo 成功的必要條件。
真實公司 CLI 仍可能需要 OAuth、token、SSO、VPN 或專案權限；CLI first 的價值是授權點比較可見，且比較容易先停在 export 檔、dry-run payload 或本機 fixture。

學生上課建議直接開互動式 UI：

```bash
claude
```

或：

```bash
codex
```

進入互動式 UI 後，再貼各 case 下方的 prompt。`claude -p` / `codex exec` 是講師課前 smoke test 用，不是學生上課主流程。

## 2. Case 04 - PRD 初稿產生與審查

用途：展示 agent 如何把 brief 和 template 轉成可 review 的 PRD 草稿。

先讓學生看 input：

```bash
sed -n '1,220p' demo-data/fixtures/prd-template.md
sed -n '1,220p' demo-data/fixtures/feature-brief-order-export.md
sed -n '1,220p' demo-data/prompts/prd-draft.md
```

貼給 Claude Code / Codex 的 prompt：

```text
請讀 `demo-data/prompts/prd-draft.md`，並依照裡面的指示執行。
只讀 prompt 內指定的 fixture，不要改檔，直接在對話裡輸出結果。
```

如果想手動貼完整 prompt，直接複製：

```bash
sed -n '1,260p' demo-data/prompts/prd-draft.md
```

Fallback：

```bash
npm run demo:case -- prd-draft
```

檢查重點：
- 是否把 facts、assumptions、open questions 分清楚。
- 是否沒有替 Compliance / Finance 做最終決策。
- 是否有 `Review Checklist` 和 `HITL Questions`。

## 3. Case 13 - PRD + Codebase 轉技術問題清單

用途：展示 codebase 只能當技術證據，不能直接推論產品意圖。

先讓學生看 input：

```bash
sed -n '1,220p' demo-data/fixtures/codebase-prd.md
find demo-data/demo-repo -type f | sort
sed -n '1,260p' demo-data/prompts/technical-questions.md
```

貼給 Claude Code / Codex 的 prompt：

```text
請讀 `demo-data/prompts/technical-questions.md`，並依照裡面的指示執行。
只讀 prompt 內指定的 PRD 和 demo repo 檔案，不要掃整個 repo，不要改檔。
```

Fallback：

```bash
npm run demo:case -- technical-questions
```

檢查重點：
- Code facts 是否附檔案路徑。
- Assumptions 是否和 facts 分開。
- 是否指出 audit helper 存在但沒有被 export flow 呼叫。
- 是否把 buyer email masking 留給 Compliance 確認。

## 4. Case 03 - 會議紀錄轉 Action Items

用途：展示 agent 如何把半結構化會議紀錄整理成可追蹤工作項。

先讓學生看 input：

```bash
sed -n '1,220p' demo-data/fixtures/meeting-notes.md
sed -n '1,220p' demo-data/prompts/meeting-actions.md
```

貼給 Claude Code / Codex 的 prompt：

```text
請讀 `demo-data/prompts/meeting-actions.md`，並依照裡面的指示執行。
只讀 prompt 內指定的 meeting notes，不要改檔，直接輸出 action item 表格。
```

Fallback：

```bash
npm run demo:case -- meeting-actions
```

檢查重點：
- 沒有明確 due date 的項目是否標 `未指定`。
- unresolved decisions 是否沒有被偽裝成已分派工作。
- Follow-up questions 是否能幫 PM 追下一步。

## 5. Case 02 - JIRA Epic 建 Sub-tasks 草稿

用途：展示 production write 前先做 dry-run。

先讓學生看 input：

```bash
cat demo-data/fixtures/jira-epic.json
sed -n '1,260p' demo-data/prompts/jira-subtasks.md
```

貼給 Claude Code / Codex 的 prompt：

```text
請讀 `demo-data/prompts/jira-subtasks.md`，並依照裡面的指示執行。
這是 dry-run，不要呼叫 JIRA，不要建立 issue，不要 assign 真實同事，不要改檔。
```

Fallback：

```bash
npm run demo:case -- jira-subtasks
```

檢查重點：
- JSON 是否包含 `"dryRun": true`。
- 是否只列 `wouldCreate`，沒有真的寫外部系統。
- 是否把 PM / Tech Lead / Compliance 要先確認的問題放進 `humanReviewRequired`。

## 6. 上課前自檢

```bash
npm run demo:list
npm run demo:case -- all
npm run build
npm run lint
```

如果只需要 demo CLI，不跑網站，可以只跑前兩個 command。
這個 demo CLI 只用 Node built-ins 和本機 `demo-data/`，不需要 `npm install`，也不呼叫外部服務。

## 7. 用 Claude Code Print Mode 評估

如果講師想在課前用 Claude Code 直接 smoke test prompt，可以用 `claude -p`。建議用預設模型，不要用 Haiku 檢查語言品質；實測 Haiku 容易混入中國用語。

Case 04:

```bash
claude -p --allowedTools Read --permission-mode auto \
  "請讀 demo-data/prompts/prd-draft.md，並依照裡面的指示執行。只讀 prompt 內指定的 fixture，不要改檔，直接在對話裡輸出結果。"
```

Case 13:

```bash
claude -p --allowedTools Read --permission-mode auto \
  "請讀 demo-data/prompts/technical-questions.md，並依照裡面的指示執行。只讀 prompt 內指定的 PRD 和 demo repo 檔案，不要掃整個 repo，不要改檔。"
```

Case 03:

```bash
claude -p --allowedTools Read --permission-mode auto \
  "請讀 demo-data/prompts/meeting-actions.md，並依照裡面的指示執行。只讀 prompt 內指定的 meeting notes，不要改檔，直接輸出 action item 表格。"
```

Case 02:

```bash
claude -p --allowedTools Read --permission-mode auto \
  "請讀 demo-data/prompts/jira-subtasks.md，並依照裡面的指示執行。這是 dry-run，不要呼叫 JIRA，不要建立 issue，不要 assign 真實同事，不要改檔。"
```

這些指令只允許 Claude Code 使用 `Read` tool；不需要 Google / JIRA / MCP auth。
若改成讀公司內部 CLI 或 live 外部系統，仍要另外處理 OAuth、token、SSO、VPN 或專案權限。

## 8. 用 Codex Exec 評估

講師也可以用 `codex exec` 做非互動 smoke test。學生上課仍建議用互動式 `codex`。

Case 03:

```bash
codex --sandbox read-only --ask-for-approval never exec --ephemeral \
  "請讀 demo-data/prompts/meeting-actions.md，並依照裡面的指示執行。只讀 prompt 內指定的 meeting notes，不要改檔，直接輸出 action item 表格。"
```

Case 02:

```bash
codex --sandbox read-only --ask-for-approval never exec --ephemeral \
  "請讀 demo-data/prompts/jira-subtasks.md，並依照裡面的指示執行。這是 dry-run，不要呼叫 JIRA，不要建立 issue，不要 assign 真實同事，不要改檔。"
```

Case 04:

```bash
codex --sandbox read-only --ask-for-approval never exec --ephemeral \
  "請讀 demo-data/prompts/prd-draft.md，並依照裡面的指示執行。只讀 prompt 內指定的 fixture，不要改檔，直接在對話裡輸出結果。"
```

Case 13:

```bash
codex --sandbox read-only --ask-for-approval never exec --ephemeral \
  "請讀 demo-data/prompts/technical-questions.md，並依照裡面的指示執行。只讀 prompt 內指定的 PRD 和 demo repo 檔案，不要掃整個 repo，不要改檔。"
```

這些指令不需要 Google / JIRA / MCP auth；只需要本機已登入 Codex。
若改成讀公司內部 CLI 或 live 外部系統，仍要另外處理 OAuth、token、SSO、VPN 或專案權限。
