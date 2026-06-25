# Developer Portal Sitemap

## Personas

| Persona | Goal | Portal Needs |
| --- | --- | --- |
| Solo developer | Build a prototype quickly | Quick start, sandbox keys, copyable code |
| Enterprise integration team | Plan production integration | API specs, SLA, rate limits, certificate setup |
| Compliance officer | Review risk and obligations | Consent model, audit, data handling, policies |

## Navigation

```text
Home
Docs
  Getting Started
  Authentication
  API Reference
    Accounts
    Consents
    Payments
    Events
Sandbox
  Test Data
  Mock APIs
  Error Simulation
Dashboard
  Applications
  API Keys
  Usage Metrics
  Webhooks
Status
Support
```

## User Journeys

### Solo Developer

1. Registers account.
2. Creates sandbox application.
3. Reads Getting Started.
4. Creates consent.
5. Completes OAuth flow.
6. Calls `GET /accounts`.

### Enterprise Integration Team

1. Reviews API reference and SLA.
2. Configures certificates.
3. Tests Postman collection.
4. Runs contract tests.
5. Requests production onboarding.

### Compliance Officer

1. Reviews consent and data minimization.
2. Reviews audit logging.
3. Checks deprecation and incident communication policies.

## Wireframe Checklist

- [ ] Landing page / homepage
- [ ] Registration and onboarding
- [ ] Dashboard after login
- [ ] API reference with Try It
- [ ] Getting Started guide
- [ ] API status page
