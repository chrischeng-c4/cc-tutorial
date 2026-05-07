# 技術可行性問題清單

## Code Facts
- `demo-data/demo-repo/src/orders/exportCsv.js` 已經產生 UTF-8 CSV，並定義目前匯出欄位。
- `demo-data/demo-repo/src/orders/exportCsv.js` 使用 `MAX_SYNC_EXPORT_ROWS = 10000` 限制同步匯出筆數。
- `demo-data/demo-repo/src/orders/orderRepository.js` 依 `sellerId` 和 date range 篩選訂單。
- `demo-data/demo-repo/src/auth/permissions.js` 在匯出前檢查 `orders:export` permission。
- `demo-data/demo-repo/src/audit/auditLog.js` 有 export audit helper，但 `exportCsv.js` 目前沒有呼叫它。

## Assumptions
- `currentUser.sellerId` 是可信任的，且 upstream 已完成驗證。
- Date parsing / timezone handling 符合 Finance reporting 需求。
- 程式裡的 CSV 欄位順序已經由 Finance 核准。Code 本身無法證明這件事。

## Risks
- Buyer email 目前以明文匯出，但 Compliance 尚未確認 masking 規則。
- Audit logging helper 存在，但沒有接到 export flow。
- 大型匯出目前只會同步失敗，沒有 async export path。
- CSV escaping 需要補測試，尤其是逗號、換行、雙引號。

## HITL Questions
- PM：10,000 rows 是最終產品限制，還是 engineering placeholder？
- Tech Lead：成功匯出與 rejected export 是否都要呼叫 `writeExportAuditLog`？
- Compliance：buyer email 要遮罩、移除，還是只允許特定 role 匯出？
- Data / Finance：目前欄位和 date semantics 是否已核准？
