# Mock Server

This project provides two mock options:

1. A deterministic Node sandbox mock for assessment evidence and scripted testing.
2. Prism mocks generated directly from the OpenAPI files.

## Deterministic Sandbox Mock

```bash
npm install
npm run mock:sandbox
```

The mock listens on `http://localhost:4020/v3.1` by default. Override the port with `PORT=4030 npm run mock:sandbox`.

Validate it with:

```bash
npm run test:mock-server
```

## Prism Domain Mocks

```bash
npm install
npm run mock:accounts
npm run mock:consents
npm run mock:payments
npm run mock:events
```

## Dynamic Behaviour Design

The deterministic sandbox mock implements the required test triggers:

- IDs beginning with `ERR` return `500 INTERNAL_ERROR`.
- IDs beginning with `RATE` return `429 RATE_LIMIT_EXCEEDED`.
- Consent IDs beginning with `REV` return `403 CONSENT_REVOKED`.
- Payment amount `13.37` returns a simulated fraud rejection.

These behaviours are documented in `docs/sandbox/sandbox-specification.md`. The Prism commands remain useful for checking raw OpenAPI examples by domain.
