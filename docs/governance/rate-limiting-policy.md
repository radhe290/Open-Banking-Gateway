# Rate Limiting Policy

## Algorithm

The platform uses token bucket rate limiting because it supports controlled bursts while enforcing long-term quotas.

Token bucket is selected over a fixed window because fixed windows can create unfair spikes at window boundaries. A sliding log is more precise but expensive at high traffic volumes. Token bucket gives a practical balance: developers can handle short bursts, while the platform still enforces predictable average usage. This is suitable for open banking because TPP traffic can be uneven during account aggregation refreshes, payroll events, or payment checkout peaks.

| Endpoint Category | Default Limit | Burst |
| --- | --- | --- |
| Accounts | 300/min per TPP | 100 |
| Payments | 60/min per TPP | 20 |
| Bulk operations | 10/min per TPP | 5 |
| Events polling | 120/min per TPP | 40 |

## Endpoint Tiers

| Tier | Endpoints | Reasoning |
| --- | --- | --- |
| Tier 1 Read | `GET /accounts`, balances, beneficiaries | Low risk, frequent developer usage |
| Tier 2 Transaction Read | `GET /accounts/{accountId}/transactions` | Larger payloads and date filters create heavier load |
| Tier 3 Consent Write | `POST /consents`, `DELETE /consents/{consentId}` | State-changing and tied to customer authorization |
| Tier 4 Payment Write | `POST /domestic-payments`, `POST /international-payments` | Highest financial risk, must be tightly controlled |
| Tier 5 Event Polling | `POST /events` | Needs fairness to avoid polling storms |

Payments intentionally have lower limits than account reads. A payment submission is not just an API call; it can trigger risk checks, ledger interactions, fraud monitoring, and customer notifications. Transaction history is also more tightly watched than basic account listing because it can return larger datasets.

## Headers

- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`
- `Retry-After`

Example throttled response:

```http
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 2026-06-25T10:15:00Z
Retry-After: 30
Content-Type: application/json
```

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Request limit exceeded. Retry after 30 seconds.",
    "interactionId": "7f6b4d34-0000-4000-9000-000000000020"
  }
}
```

## Increase Requests

TPPs may request higher limits after demonstrating production use, low error rates, and legitimate customer demand.

The increase review considers business justification, historical traffic, customer impact, error rate, retry behaviour, and whether the TPP uses efficient pagination and caching. A TPP that repeatedly ignores `Retry-After` should not receive higher limits until its client behaviour improves.

## Regulatory Rationale

Open banking APIs must be fair to all authorised TPPs and resilient under bursty traffic. The design avoids unlimited access for a single large participant and protects payment endpoints more tightly than read-only endpoints. Limits are evaluated by client ID, certificate thumbprint, endpoint category, and environment. Sandbox limits are lower so developers notice throttling behaviour early.

Fairness is important because regulated APIs should not allow a large aggregator to degrade access for smaller TPPs. The policy therefore includes per-client limits, per-endpoint limits, and global platform protection. During incidents, temporary protective limits may be applied, but the developer portal should communicate this clearly.

## Response Behaviour

When a client exceeds its quota, the gateway returns `429 Too Many Requests` with `Retry-After` and rate limit headers. The response body uses the shared error envelope so developers receive a stable machine-readable code. Repeated violations can trigger temporary suspension and a developer portal notification.

## Abuse and Retry Controls

Clients must use exponential backoff for retryable errors and must not retry non-idempotent payment submissions without the same `x-idempotency-key`. The gateway treats retry storms as an operational risk. If a TPP repeatedly exceeds limits, the platform can move the client to a lower temporary quota and notify the technical contact.

## Sandbox Versus Production

Sandbox quotas are intentionally lower and easier to trigger so developers can test throttling. Production quotas are based on accredited access, observed traffic, and business justification. Sandbox throttling never proves production capacity; it is a behavioural test surface for client retry logic.
