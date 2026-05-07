你正在協助 Case 13：PRD 初版 + Codebase 轉技術可行性問題清單。

請先讀：
- `demo-data/fixtures/codebase-prd.md`
- `demo-data/demo-repo/README.md`

接著只讀這些程式檔，不要掃整個 repo：
- `demo-data/demo-repo/src/orders/exportCsv.js`
- `demo-data/demo-repo/src/orders/orderRepository.js`
- `demo-data/demo-repo/src/auth/permissions.js`
- `demo-data/demo-repo/src/audit/auditLog.js`

任務：
根據 PRD draft 和 code facts，整理技術可行性問題清單。

輸出規則：
- 用台灣繁體中文與台灣慣用詞輸出，禁止使用簡體中文與中國用語。
- 用 `目前` 不用 `當前`；用 `清單` 不用 `列表`；用 `email` 不用 `郵箱`；用 `依權限篩選` 不用 `按權限過濾`。
- 不要改檔，只在對話裡輸出結果。
- Codebase 只能當技術證據；不要從 code 推論產品當初為什麼這樣設計。
- 每個 code fact 都要附檔案路徑。
- 把已確認事實、推測、風險、HITL questions 分開。

輸出格式：
1. Code Facts
2. Assumptions
3. Risks
4. HITL Questions

HITL Questions 請分成：
- PM
- Tech Lead
- Compliance
- Data / Finance
