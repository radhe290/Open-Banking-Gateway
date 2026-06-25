# Error Reference

| Code | HTTP | Cause | Fix |
| --- | --- | --- | --- |
| `BAD_REQUEST` | 400 | Payload or parameter is invalid | Compare request with OpenAPI schema |
| `UNAUTHORIZED` | 401 | Missing or invalid token | Obtain a valid access token |
| `FORBIDDEN` | 403 | Token valid but consent/scope insufficient | Request correct permission |
| `NOT_FOUND` | 404 | Resource ID does not exist or is inaccessible | Check identifier and consent scope |
| `IDEMPOTENCY_CONFLICT` | 409 | Reused key with different payload | Use a new idempotency key |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests | Respect `Retry-After` |
| `INTERNAL_ERROR` | 500 | Unexpected platform error | Retry later and contact support with interaction ID |
| `CONSENT_REVOKED` | 403 | Consent was revoked by the customer | Start a new consent flow |
| `CONSENT_EXPIRED` | 403 | Consent validity period has ended | Request fresh consent |
| `INVALID_FAPI_HEADER` | 400 | Required FAPI header is missing or malformed | Send `x-fapi-interaction-id` and `x-fapi-financial-id` |
| `PAYMENT_REJECTED` | 422 | Payment failed risk or funds checks | Inspect payment status and rejection reason |
| `INVALID_CONSENT_STATE` | 409 | Operation is not allowed for the current consent state | Retrieve consent and restart if needed |
| `CERTIFICATE_INVALID` | 401 | mTLS certificate is expired, revoked, or not linked to the app | Rotate or register the certificate |
| `REQUEST_REPLAYED` | 409 | Duplicate payment or consent request detected | Reuse the original response or send a new idempotency key for a new action |
| `UNSUPPORTED_MEDIA_TYPE` | 415 | Request content type is not supported | Send `Content-Type: application/json` |
| `SERVICE_UNAVAILABLE` | 503 | Downstream service or authorization dependency unavailable | Retry with backoff and monitor status page |

## Error Envelope

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Request limit exceeded.",
    "interactionId": "7f6b4d34-0000-4000-9000-000000000005"
  }
}
```

## Error Handling Principles

All APIs use a common error envelope so developers can implement one parser across accounts, consents, payments, and events. Human-readable messages may change, but machine-readable `code` values remain stable within a major API version. The `interactionId` is always safe to share with support and should be included in bug reports.

The platform avoids exposing sensitive details in errors. For example, a `404` may mean the resource does not exist or that the TPP does not have consent to access it. This prevents resource enumeration while still giving developers enough information to inspect IDs and consent scope.

## Common Recovery Patterns

| Scenario | Recommended Developer Action |
| --- | --- |
| Missing FAPI header | Add required headers and retry with a new interaction ID |
| Expired access token | Use the refresh flow or restart authorization |
| Revoked consent | Stop polling the resource and ask the customer to authorize again |
| Payment idempotency conflict | Do not submit a second payment; retrieve the existing payment status |
| Rate limit exceeded | Respect `Retry-After` and use exponential backoff |
| Certificate invalid | Check certificate expiry, thumbprint, and app registration |
| Service unavailable | Retry only idempotent operations and monitor the status page |

## Corrected Request Example

```bash
curl https://sandbox.meridian.example/v3.1/accounts \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "x-fapi-interaction-id: 7f6b4d34-0000-4000-9000-000000000010" \
  -H "x-fapi-financial-id: meridian-bank"
```

Developers should include the interaction ID in support tickets. The gateway copies that value to audit logs, traces, and error responses so support teams can correlate a developer report without exposing tokens or customer data.

## Payment Error Example

```json
{
  "error": {
    "code": "PAYMENT_REJECTED",
    "message": "The payment was rejected by simulated risk checks.",
    "interactionId": "7f6b4d34-0000-4000-9000-000000000021",
    "details": [
      {
        "field": "instructedAmount.amount",
        "issue": "Sandbox trigger amount 13.37 produces a fraud rejection."
      }
    ]
  }
}
```

## Support Escalation

Developers should open a support ticket when the same interaction fails after following the documented fix, when a production certificate appears to be incorrectly rejected, when payment status remains pending beyond the published SLA, or when the status page does not reflect observed platform errors. Support tickets should include environment, endpoint, HTTP method, timestamp, interaction ID, app/client ID, and sanitized request body.
