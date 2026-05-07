# Meeting Notes: Seller Export Kickoff

Date: 2026-05-06

Attendees:
- Mina, PM
- Derek, Tech Lead
- Iris, Support
- Owen, Data

Notes:
- Support gets around 40 tickets per month asking for seller order exports.
- PM wants a simple CSV export button on the Orders page.
- Tech Lead says the first version should cap exports at 10,000 rows and show an error when the date range is too large.
- Data wants the exported `order_status`, `paid_at`, `currency`, `gross_amount`, and `refund_amount` columns.
- Support wants the error copy ready before launch.
- Compliance still needs to confirm whether buyer email should be masked.
- Derek will check if the current orders API already filters by seller permissions.
- Mina will provide final CSV columns by Friday, 2026-05-08.
- Iris will draft support FAQ after the staging build is ready.
