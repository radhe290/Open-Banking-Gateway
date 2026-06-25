# Regulatory Comparison

## Purpose

This document compares four major open banking regimes and identifies design implications for the simulated API gateway.

## Comparison Matrix

| Dimension | PSD2 / EU | UK Open Banking | India Account Aggregator | Australia CDR |
| --- | --- | --- | --- | --- |
| Scope | Payment accounts, account information, payment initiation | Read/write banking APIs for CMA9 and wider ecosystem | Financial information sharing through consent artefacts | Consumer data sharing across banking, energy, and more |
| Consent model | Explicit PSU consent, SCA-driven | Granular permissions, consent dashboards, re-authentication expectations | Consent artefact managed through AA ecosystem | Accredited data recipient consent and dashboards |
| Security profile | OAuth 2.0, SCA, eIDAS certificates | OAuth 2.0/OIDC, FAPI-aligned controls, directory certificates | FIU/FIP/AA trust model, signed artefacts | FAPI 1.0 Advanced, mTLS, PAR/JARM concepts |
| API standard | Berlin Group, STET, UK variants | OBIE Read/Write API | ReBIT AA API specifications | Consumer Data Standards |
| Governance body | EU regulators and national competent authorities | OBIE / successor entities | RBI/ReBIT ecosystem | Data Standards Body and ACCC |
| Design implication | Support SCA, consent evidence, certificate validation | Strong developer documentation and conformance-minded APIs | Model consent as independent object | Use strongest FAPI controls as baseline |

## Architecture Implications

1. The gateway should validate both OAuth scopes and consent permissions.
2. Consent should be a first-class resource with audit trails and revocation.
3. The platform should assume mTLS-capable clients for high-risk endpoints.
4. API documentation must be clear enough for regulated third-party providers.
5. Monitoring must expose availability, latency, error rate, and consent conversion.

## TODO

- Add 6-10 citations from official standards pages.
- Add your own final judgement on which regime most influenced this design.
