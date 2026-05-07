# PRD 回補建議

## 1. Facts
- `demo-data/demo-repo/src/orders/exportCsv.js:5` 定義同步匯出上限為 `MAX_SYNC_EXPORT_ROWS = 10000`。
- `demo-data/demo-repo/src/orders/exportCsv.js:7-15` 目前 CSV 欄位包含 `order_id`、`order_status`、`paid_at`、`currency`、`gross_amount`、`refund_amount`、`buyer_email`。
- `demo-data/demo-repo/src/orders/exportCsv.js:17-20` 匯出前會呼叫 `canExportOrders(currentUser)`，權限不足時丟出 `permission_denied`。
- `demo-data/demo-repo/src/orders/exportCsv.js:22-26` 查詢訂單時會用 `currentUser.sellerId`、`dateRange` 和 `MAX_SYNC_EXPORT_ROWS + 1` 作為查詢條件。
- `demo-data/demo-repo/src/orders/exportCsv.js:28-30` 超過同步上限時丟出 `export_too_large`。
- `demo-data/demo-repo/src/orders/exportCsv.js:32-40` 目前 `buyerEmail` 會被直接寫入 CSV。
- `demo-data/demo-repo/src/orders/exportCsv.js:42-43` 目前只有保留 audit log TODO，沒有實際呼叫 `writeExportAuditLog`。
- `demo-data/demo-repo/src/auth/permissions.js:1-3` 匯出權限需要 user 有 `sellerId` 且 permissions 包含 `orders:export`。

## 2. PRD sections to update
- Requirements：補上同步匯出 row limit 目前實作為 10,000 rows，但需標成待 Tech Lead / PM 確認。
- Requirements：補上匯出權限條件：使用者必須有 seller identity 與 `orders:export` permission。
- Requirements 或 Edge Cases：補上超過同步匯出上限時會回 `export_too_large`，產品文案需讓使用者縮小日期範圍。
- Open Questions：保留 buyer email masking 問題，因為目前 code 會直接輸出 email。
- Open Questions：保留 audit log 問題，因為 code 目前只有 TODO，尚未接入實際紀錄。

## 3. Suggested wording
可補進 Requirements：

- 系統只允許具備 `orders:export` permission 且有 seller identity 的使用者匯出訂單 CSV。
- 第一版同步匯出目前以 10,000 rows 為工程上限；超過上限時應顯示清楚錯誤，請使用者縮小日期範圍。此上限需由 PM / Tech Lead 確認是否為產品承諾。
- CSV 目前包含 buyer email；是否需遮罩、移除或改為 role-based 顯示，需由 Compliance 確認。

可補進 Edge Cases：

- 權限不足時，系統不得產生 CSV，也不得透露訂單資料。
- 超過同步匯出上限時，系統應停止產生 CSV，提示使用者縮小日期範圍或等待未來 async export。
- Buyer email 若需遮罩，需定義遮罩格式與例外權限。

## 4. Assumptions
- `currentUser.sellerId` 已由上游登入流程驗證可信。
- PRD 中的「UTF-8 CSV」是否需要 UTF-8 with BOM，code 目前無法證明。
- `dateRange` 的 timezone 與 inclusive / exclusive 邊界尚未從這兩個檔案確認。

## 5. Open questions / HITL
- PM：10,000 rows 是 v1 產品限制，還是暫時的工程 placeholder？
- Tech Lead：是否需要 async export path，或 v1 只接受同步匯出加錯誤提示？
- Compliance：buyer email 是否可以明文匯出？是否需要遮罩或 role-based permission？
- Finance：目前欄位順序與欄位命名是否可直接給對帳流程使用？
- Tech Lead：成功匯出、權限失敗、超過上限是否都需要 audit log？
