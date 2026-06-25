# Rate Limiting Policy

## Algorithm

The platform uses token bucket rate limiting because it supports controlled bursts while enforcing long-term quotas.

| Endpoint Category | Default Limit | Burst |
| --- | --- | --- |
| Accounts | 300/min per TPP | 100 |
| Payments | 60/min per TPP | 20 |
| Bulk operations | 10/min per TPP | 5 |
| Events polling | 120/min per TPP | 40 |

## Headers

- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`
- `Retry-After`

## Increase Requests

TPPs may request higher limits after demonstrating production use, low error rates, and legitimate customer demand.
