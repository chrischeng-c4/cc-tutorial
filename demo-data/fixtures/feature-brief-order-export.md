# Feature Brief: Seller Order CSV Export

## Background
Seller support receives repeated tickets from small sellers who need a simple CSV export of their own order history for monthly reconciliation.

## Target User
Seller account owners and finance operators.

## Requested Behavior
- Seller can export order history from the Orders page.
- Export format is CSV.
- Seller can choose a date range.
- Export should include only orders the current seller is allowed to view.
- The first version can be synchronous if the selected date range is small.

## Known Constraints
- Finance team wants columns to be stable after launch.
- Engineering is concerned about very large exports.
- Compliance asked whether buyer email and phone should be masked.
- Support wants the UI copy to make processing status clear.

## Out of Scope
- Scheduled exports.
- Sending exports by email.
- Cross-seller admin export.

## Success Metric
- Reduce seller support tickets about order reconciliation by 30% within one quarter.

