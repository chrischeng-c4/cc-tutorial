你正在協助 Case 02：JIRA Epic 建立 Sub-tasks 草稿。

請只讀這個檔案：
- `demo-data/fixtures/jira-epic.json`

任務：
根據 Epic 內容產生 JIRA sub-task 草稿。

重要限制：
- 用台灣繁體中文與台灣慣用詞輸出，禁止使用簡體中文與中國用語。
- 用 `目前` 不用 `當前`；用 `清單` 不用 `列表`；用 `email` 不用 `郵箱`；用 `依權限篩選` 不用 `按權限過濾`。
- 這是 dry-run。
- 不要呼叫 JIRA。
- 不要建立 issue。
- 不要 assign 真實同事。
- 不要改檔，只在對話裡輸出結果。

Sub-task 分組固定為：
- Frontend
- Backend
- QA
- Docs
- PM / Compliance

輸出格式必須是純 JSON：
- 只輸出 JSON object。
- 不要使用 Markdown code fence。
- 不要在 JSON 前後加摘要、說明或條列文字。
- JSON 必須可以被 `JSON.parse` 解析。

Schema：
```json
{
  "dryRun": true,
  "sourceEpic": "EPIC_KEY",
  "wouldCreate": [
    {
      "type": "Backend",
      "summary": "...",
      "description": "..."
    }
  ],
  "humanReviewRequired": [
    "..."
  ]
}
```

最後在 `humanReviewRequired` 放入需要 PM / Tech Lead / Compliance 先確認的事項。
