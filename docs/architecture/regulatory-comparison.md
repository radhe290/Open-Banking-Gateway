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

## Design Judgement

The design uses FAPI-style controls as the strongest common denominator because Australia CDR and UK Open Banking both demonstrate the direction of travel for high-assurance financial APIs. PSD2 contributes the regulatory need for strong customer authentication, dedicated interfaces, and certificate-backed trust. India AA contributes the most useful consent lesson: consent should be a granular artefact with purpose, scope, duration, and revocation behaviour, not a simple yes/no flag.

For this simulated bank, the UK Open Banking model most influenced the API surface because it gives the clearest reference for accounts, balances, transactions, payments, and event notifications. The India AA model most influenced the consent lifecycle, while Australia CDR influenced the decision to make FAPI Advanced controls the baseline rather than an optional enhancement.

## References

- European Commission, Revised Payment Services Directive (PSD2).
- European Banking Authority, Regulatory Technical Standards on Strong Customer Authentication.
- Open Banking UK, Read/Write API and Customer Experience Guidelines.
- Open Banking UK, Directory and certificate trust framework guidance.
- ReBIT and Sahamati, Account Aggregator ecosystem specifications and consent artefact model.
- Reserve Bank of India, NBFC Account Aggregator directions.
- Australian Data Standards Body, Consumer Data Standards.
- Australian Competition and Consumer Commission, Consumer Data Right guidance.
- OpenID Foundation, Financial-grade API security profiles.
- OpenAPI Initiative, OpenAPI Specification 3.0.3.
