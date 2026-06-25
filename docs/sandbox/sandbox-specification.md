# Sandbox Specification

## Goals

The sandbox lets third-party developers test account access, consent, payment initiation, event polling, errors, and rate limiting without touching real customer data.

## Synthetic Data

| Data Type | Volume | Notes |
| --- | --- | --- |
| Customers | 20 | Mix of retail, SME, and edge-case profiles |
| Accounts | 50 | Current, savings, credit, dormant |
| Transactions | 2,000 | Salary, bills, card payments, refunds, reversals |
| Beneficiaries | 100 | Domestic and international examples |
| Payments | 200 | Pending, accepted, rejected, settled |

## Edge Cases

- Empty account list.
- Dormant account.
- Negative available balance.
- Transaction reversal.
- Payment rejected for insufficient funds.
- Consent expired.
- Consent revoked during API access.

## Error Injection

| Trigger | Result |
| --- | --- |
| Account ID starts with `ERR` | 500 internal error |
| Account ID starts with `RATE` | 429 rate limit response |
| Consent ID starts with `REV` | 403 revoked consent |
| Payment amount is `13.37` | Simulated fraud rejection |

## Data Reset

Sandbox data should reset nightly and also support manual reset per developer application.
