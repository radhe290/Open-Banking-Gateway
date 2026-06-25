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

## Corrected Request Example

```bash
curl https://sandbox.meridian.example/v3.1/accounts \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "x-fapi-interaction-id: 7f6b4d34-0000-4000-9000-000000000010" \
  -H "x-fapi-financial-id: meridian-bank"
```

Developers should include the interaction ID in support tickets. The gateway copies that value to audit logs, traces, and error responses so support teams can correlate a developer report without exposing tokens or customer data.
