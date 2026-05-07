# Seller Order CSV Export - PRD 草稿

## 1. Problem
Seller account owner 和 finance operator 需要可靠地匯出自己的訂單紀錄，用於每月對帳。Support 目前持續收到與訂單匯出相關的需求 ticket。

## 2. Goals
- 讓 seller 可以從 Orders page 匯出訂單紀錄。
- 一季內讓訂單對帳相關 support ticket 減少 30%。
- 第一版先保持簡單，不包含排程匯出或 email delivery。

## 3. Non-goals
- 排程匯出。
- 用 email 寄送匯出檔。
- 跨 seller 的 admin export。

## 4. User Stories
- As a seller account owner, I want to export orders for a selected date range so I can reconcile monthly finances.
- As a finance operator, I want stable CSV columns so downstream spreadsheets do not break.
- As support, I want clear error copy so sellers understand how to narrow large exports.

## 5. Requirements
- Orders page 要有 CSV export 入口。
- 使用者匯出前可以選 date range。
- 匯出內容只能包含目前 seller 有權查看的訂單。
- CSV 欄位上線前要由 Finance 確認。
- 匯出資料量過大時，要顯示清楚錯誤訊息，請使用者縮小 date range。
- Buyer email / phone 的處理方式要等 Compliance 確認。

## 6. Edge Cases
- 空 date range 要回傳只有 header 的有效 CSV，或顯示清楚 empty state。
- 過大的 date range 要在 expensive export work 前先拒絕。
- Permission denied 時不能匯出，也不能洩漏訂單資料。
- Partial failure 不能讓使用者誤以為下載成功。

## 7. Open Questions
- 同步匯出的 row limit 最終是多少？
- Buyer email / phone 是否要遮罩？
- Finance 最終核准的欄位與順序是什麼？
- 每次匯出是否需要 audit log？

## 8. Launch / Rollout
- 先用 feature flag 開給小量 seller。
- 監控 export error、row-limit rejection、support ticket 量。
- 需要 rollback 時關閉 feature flag。

## Review Checklist
- Finance 確認欄位名稱與順序。
- Compliance 確認 PII masking 規則。
- Tech Lead 確認 row limit 與 permission filtering。
- Support 確認錯誤文案與 FAQ。

## HITL Questions
- PM：第一版是否只支援同步匯出？
- Tech Lead：目前 orders API 是否已經完整依 seller permission filter？
- Compliance：buyer email / phone 要遮罩、移除，還是依 role 顯示？
- Support：large export error copy 是否足夠清楚？
