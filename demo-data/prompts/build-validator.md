你是 coding agent。任務：幫我打造一支可重跑的 CLI 驗證器，檢查 JIRA bulk dry-run JSON 的格式。
這個練習的重點不是「會不會寫 Node.js」，而是「先寫 script、先 dry-run、再 apply」這個工作流。

## 允許讀寫範圍

- 只允許讀：
  - `demo-data/expected/jira-subtasks-dry-run.json` （當作範例輸入）
- 只允許寫：
  - `scripts/validate-jira-bulk.mjs` （新檔案）
- 不要動任何其他檔案，不要呼叫網路。

## CLI 契約

1. 從 `process.argv[2]` 取輸入 JSON 路徑；參數缺失印 usage 並 `exit 2`。
2. 讀檔失敗或 JSON parse 失敗，印錯誤訊息並 `exit 1`。
3. 驗證規則：
   - top-level 必須有 `dryRun`、`sourceEpic`、`wouldCreate` 三個欄位。
   - `dryRun` 嚴格等於 `true`（不能是 truthy）。
   - `sourceEpic` 必須是非空字串。
   - `wouldCreate` 必須是 array；每筆必須含 `summary`（非空字串）與 `type`（非空字串）。
4. 印報告：檔名、task 數、error 數；有錯時多行條列。
5. 全部通過 `exit 0`、驗證失敗 `exit 1`、參數錯 `exit 2`。

## 語言規則

- 程式碼註解與 stdout 訊息：用台灣繁體中文與台灣慣用詞，禁止使用簡體中文與中國用語。
- 例外：JSON key 名稱、技術術語、CLI usage 行可保留英文。

## 輸出規則

完成檔案後請在對話裡：

1. 用 facts / assumptions / open questions 三段交代你的設計決策，例如：
   - 為什麼選 `exit 2` 給參數錯而不是 `exit 1`。
   - 為什麼 `dryRun` 用嚴格相等。
   - 哪些假設未來可能要改（例如：是否該支援多檔、是否要支援 JSON Schema）。
2. 列三個試跑指令：
   - 沒帶參數 → 預期 stderr usage、`exit 2`。
   - 帶 `demo-data/expected/jira-subtasks-dry-run.json` → 預期 OK、`exit 0`。
   - 帶一個刻意改壞的 JSON（例如 `dryRun: false`）→ 預期錯誤條列、`exit 1`。
3. 不要替使用者執行真正的 `node`；只列指令與預期輸出。
