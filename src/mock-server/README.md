# Mock Server

This project uses Prism for mock responses from OpenAPI files.

```bash
npm install
npm run mock:accounts
npm run mock:consents
npm run mock:payments
npm run mock:events
```

## Dynamic Behaviour Design

The OpenAPI-backed Prism mocks provide the default response shape. A production-grade sandbox would add middleware for deterministic test triggers:

- IDs beginning with `ERR` return `500 INTERNAL_ERROR`.
- IDs beginning with `RATE` return `429 RATE_LIMIT_EXCEEDED`.
- Consent IDs beginning with `REV` return `403 CONSENT_REVOKED`.
- Payment amount `13.37` returns a simulated fraud rejection.

These behaviours are documented in `docs/sandbox/sandbox-specification.md` and can be implemented later as a small Node/Express proxy in front of Prism.
