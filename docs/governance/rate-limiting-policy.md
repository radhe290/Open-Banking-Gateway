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

## Regulatory Rationale

Open banking APIs must be fair to all authorised TPPs and resilient under bursty traffic. The design avoids unlimited access for a single large participant and protects payment endpoints more tightly than read-only endpoints. Limits are evaluated by client ID, certificate thumbprint, endpoint category, and environment. Sandbox limits are lower so developers notice throttling behaviour early.

## Response Behaviour

When a client exceeds its quota, the gateway returns `429 Too Many Requests` with `Retry-After` and rate limit headers. The response body uses the shared error envelope so developers receive a stable machine-readable code. Repeated violations can trigger temporary suspension and a developer portal notification.
