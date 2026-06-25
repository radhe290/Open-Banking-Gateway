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
