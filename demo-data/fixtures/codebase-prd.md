# PRD Draft: Seller Order CSV Export

## Goal
Allow sellers to export their own order history as CSV from the Orders page.

## Requirements
- Seller can choose a date range.
- Export includes order id, status, paid time, currency, gross amount, refund amount, and buyer email.
- Export must only include orders owned by the current seller.
- If the export is too large, show a clear error and ask the user to narrow the date range.
- Output should be UTF-8 CSV.

## Open Questions
- Should buyer email be masked?
- What is the max row count for synchronous export?
- Do we need an audit log entry for each export?

