# Technical Report

## Executive Summary

This project designs a simulated open banking API gateway and developer portal for a mid-size bank launching regulated third-party access. The solution covers four API domains: consent management, account information, payment initiation, and event notifications. The design uses OpenAPI 3.0.3 as the API contract format, OAuth 2.0 Authorization Code with PKCE for delegated authorization, and FAPI-aligned controls such as mTLS, PAR, JARM, signed request objects, and certificate-bound tokens for financial-grade security.

The platform uses a federated gateway pattern by API domain. Accounts, payments, consents, and events can each apply domain-specific policies while sharing common controls for authentication, authorization, schema validation, rate limiting, response normalization, audit logging, and monitoring. Consent is treated as a first-class resource with lifecycle states, permissions, expiry, revocation, and token binding.

The developer portal design focuses on fast onboarding, clear API references, working code examples, a sandbox environment, and an error reference. Governance artefacts define rate limiting, versioning, deprecation, and monitoring so the platform can operate predictably after launch.

## Regulatory Landscape Analysis

PSD2 establishes the need for dedicated interfaces, strong customer authentication, and regulated third-party access for account information and payment initiation. UK Open Banking adds detailed read/write API conventions, directory-backed trust, event notifications, and strong developer experience expectations. India's Account Aggregator framework contributes a granular consent artefact model where purpose, data type, frequency, and retention are explicit. Australia CDR demonstrates a cross-sector data-sharing model and a strong security baseline through FAPI Advanced concepts.

The design combines these lessons by using UK-style API domain coverage, India AA-style consent granularity, PSD2-style SCA and certificate awareness, and CDR/FAPI-style hardening.

## Architecture Design Rationale

The selected gateway pattern is federated by domain. A single monolithic gateway would be simpler, but payments carry higher risk than read-only account information and should be easier to isolate. A pure BFF pattern would help the portal UI but would not solve regulated third-party API traffic. The federated pattern gives each API family independent policy control while keeping shared operational capabilities.

The major components are public load balancer, WAF, TLS/mTLS termination, OAuth/FAPI policy engine, OpenAPI request validator, rate limiter, domain router, response transformer, audit logger, metrics and tracing pipeline, and backend domain services. Kong is selected as the simulated gateway because it supports declarative configuration, plugins, rate limiting, authentication integration, and portable deployment.

## Security Model Analysis

The authorization model starts with consent creation and then redirects the customer through an authorization server using Authorization Code with PKCE. PAR protects authorization parameters through a back-channel request, JARM signs the authorization response, and mTLS binds regulated clients to certificates. Access tokens are short-lived, scope-limited, audience-restricted, and linked to consent identifiers. Refresh tokens are rotated and revoked on consent revocation.

Threat mitigations include schema validation for injection, certificate validation for spoofing, state and PKCE for CSRF and code injection, idempotency keys for payment replay, and consent-to-token checks for scope escalation.

## Developer Experience Strategy

The portal is structured around onboarding, app registration, API reference, Getting Started, authentication, error reference, status, and support. The onboarding journey is designed to let a developer create an app, configure certificates, create sandbox consent, exchange a token, and make the first accounts call quickly.

The sandbox includes synthetic data, deterministic error injection, configurable latency concepts, and reset behaviour. The error reference uses stable machine-readable codes with causes and fixes so developers can debug without relying on support tickets for common failures.

## Governance Framework

Rate limiting uses token bucket controls with endpoint-specific tiers for accounts, payments, bulk operations, and events. Versioning uses URI major versions and metadata/changelog entries for non-breaking changes. Deprecation includes notice periods, headers, migration guidance, and final `410 Gone` enforcement. Monitoring covers request volume, latency, error rates, consent conversion, rate limit violations, payment failures, and TPP traffic concentration.

## Limitations and Future Work

The repository is a design and simulation submission, not a production banking implementation. Future enhancements would include a runnable custom mock proxy for dynamic sandbox behaviour, generated developer documentation site, richer contract tests for all endpoints, production-grade certificate validation examples, and deeper conformance mapping to each jurisdiction's official test suites.

## References

1. OpenAPI Initiative, OpenAPI Specification 3.0.3.
2. OpenID Foundation, OAuth 2.0 Financial-grade API Security Profile.
3. OpenID Foundation, FAPI 1.0 Advanced Final.
4. OpenID Foundation, Pushed Authorization Requests.
5. OpenID Foundation, JWT Secured Authorization Response Mode.
6. IETF, OAuth 2.0 Authorization Framework.
7. IETF, Proof Key for Code Exchange by OAuth Public Clients.
8. IETF, OAuth 2.0 Mutual-TLS Client Authentication and Certificate-Bound Access Tokens.
9. European Commission, PSD2 overview.
10. European Banking Authority, RTS on Strong Customer Authentication.
11. Open Banking UK, Read/Write Data API specifications.
12. Open Banking UK, Customer Experience Guidelines.
13. Open Banking UK, Directory specifications.
14. Reserve Bank of India, Account Aggregator master directions.
15. ReBIT, Account Aggregator API specifications.
16. Sahamati, Account Aggregator ecosystem guidance.
17. Australian Data Standards Body, Consumer Data Standards.
18. ACCC, Consumer Data Right guidance.
19. Stoplight Spectral documentation.
20. Stoplight Prism documentation.
21. Kong Gateway documentation.
22. OWASP API Security Top 10.
