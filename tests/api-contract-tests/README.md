# API Contract Tests

Run:

```bash
npm run test:postman
npm run test:mock-server
```

`test:postman` validates that the exported Postman collection contains all 22 required requests, sandbox and production variables, shared JSON/error assertions, and idempotency headers on POST requests.

`test:mock-server` starts the local sandbox mock on a random port and verifies representative success, rate limit, revoked consent, internal error, fraud rejection, and event polling responses.
