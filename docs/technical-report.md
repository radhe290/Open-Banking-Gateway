# Technical Report

## Executive Summary

This project designs a simulated open banking API gateway and developer portal for a mid-size bank launching regulated third-party access. The solution covers four API domains: consent management, account information, payment initiation, and event notifications. The design uses OpenAPI 3.0.3 as the API contract format, OAuth 2.0 Authorization Code with PKCE for delegated authorization, and FAPI-aligned controls such as mTLS, PAR, JARM, signed request objects, and certificate-bound tokens for financial-grade security.

The platform uses a federated gateway pattern by API domain. Accounts, payments, consents, and events can each apply domain-specific policies while sharing common controls for authentication, authorization, schema validation, rate limiting, response normalization, audit logging, and monitoring. Consent is treated as a first-class resource with lifecycle states, permissions, expiry, revocation, and token binding.

The developer portal design focuses on fast onboarding, clear API references, working code examples, a sandbox environment, and an error reference. Governance artefacts define rate limiting, versioning, deprecation, and monitoring so the platform can operate predictably after launch.

The central design objective is to balance three pressures that usually conflict in real banking programmes. Compliance teams need strict authentication, auditable consent, and evidence that third-party providers cannot exceed authorised access. Business teams need a platform that can launch quickly and support new fintech partnerships without rebuilding every integration manually. Developers need predictable documentation, stable error responses, realistic sandbox behaviour, and a portal that reduces support dependency. The repository responds to those pressures by treating the API gateway as a policy enforcement point, the OpenAPI specifications as the source of truth, and the developer portal as a product experience rather than a static documentation site.

The resulting architecture is intentionally practical. It does not attempt to model every national open banking endpoint in full depth, because that would create noise for this assessment. Instead, it selects the core cross-regime capabilities required by the brief: account information, payments, consent lifecycle, event notification, FAPI security controls, gateway operations, sandbox support, and API governance. This gives the evaluator a coherent end-to-end platform view.

## Regulatory Landscape Analysis

PSD2 establishes the need for dedicated interfaces, strong customer authentication, and regulated third-party access for account information and payment initiation. UK Open Banking adds detailed read/write API conventions, directory-backed trust, event notifications, and strong developer experience expectations. India's Account Aggregator framework contributes a granular consent artefact model where purpose, data type, frequency, and retention are explicit. Australia CDR demonstrates a cross-sector data-sharing model and a strong security baseline through FAPI Advanced concepts.

The design combines these lessons by using UK-style API domain coverage, India AA-style consent granularity, PSD2-style SCA and certificate awareness, and CDR/FAPI-style hardening.

PSD2 is important because it frames open banking as a regulated access obligation rather than an optional partner API. For the platform design, that means the bank cannot treat third-party requests as ordinary public API traffic. Requests must be authenticated, linked to customer consent, auditable, and protected by strong customer authentication where required. PSD2 also highlights the importance of availability and non-discriminatory access. A gateway that is technically correct but unreliable would still fail the spirit of open banking.

UK Open Banking provides a more concrete implementation pattern. Its read/write API model influenced the split between account, payment, consent, and event artefacts. It also influenced the developer experience strategy: third-party providers should be able to inspect API definitions, register applications, test in a sandbox, and understand common errors without waiting for manual bank support. The repository follows the recommended anti-pattern avoidance from the brief by splitting OpenAPI files by domain rather than creating one massive specification.

India's Account Aggregator framework strongly influenced the consent model. The key lesson is that consent is not just a checkbox. It should carry purpose, scope, duration, data categories, frequency, and revocation state. Although this project is not implementing a full FIU/FIP/AA network, the consent resource and token-binding design borrow the same privacy-preserving idea: the API gateway should never assume that an authenticated client can access all customer data.

Australia CDR influences the security baseline and future extensibility. CDR is cross-sector, so it pushes the design beyond a banking-only mental model. If the platform later supports insurance, lending, wealth, or energy-like data domains, the same gateway, consent, monitoring, and developer portal patterns can be reused. The FAPI-aligned controls in the architecture are therefore not decorative additions; they are a deliberate baseline for high-trust data sharing.

## Architecture Design Rationale

The selected gateway pattern is federated by domain. A single monolithic gateway would be simpler, but payments carry higher risk than read-only account information and should be easier to isolate. A pure BFF pattern would help the portal UI but would not solve regulated third-party API traffic. The federated pattern gives each API family independent policy control while keeping shared operational capabilities.

The major components are public load balancer, WAF, TLS/mTLS termination, OAuth/FAPI policy engine, OpenAPI request validator, rate limiter, domain router, response transformer, audit logger, metrics and tracing pipeline, and backend domain services. Kong is selected as the simulated gateway because it supports declarative configuration, plugins, rate limiting, authentication integration, and portable deployment.

The architecture uses the gateway as the first strong control boundary between external TPPs and private banking systems. This boundary is important because core banking services are not designed to be directly exposed to thousands of external applications. The gateway absorbs external protocol concerns such as FAPI headers, bearer tokens, certificates, rate limits, validation, and error consistency. Backend services can then focus on domain decisions such as account ownership, payment status, ledger integration, consent state, and event generation.

The federated gateway pattern also supports operational isolation. Payments can have stricter throttles, idempotency requirements, fraud checks, and monitoring thresholds than account-read APIs. Events can be tuned for polling and notification delivery behaviour. Consent APIs can be tied more closely to authorization server state. This separation helps the bank change one domain without forcing a versioning event across the entire API estate.

Kong is selected for the simulated design because it is practical for a prototype and supports gateway concerns that map directly to the project brief. Apigee would be strong for enterprise analytics, monetisation, and a polished portal, but it is heavier for a student design sprint. AWS API Gateway is attractive in an AWS-only architecture but introduces cloud-specific assumptions. A custom gateway is rejected because financial-grade security and governance should use proven infrastructure wherever possible.

The deployment topology assumes public ingress through a load balancer and WAF, gateway nodes across multiple availability zones, private backend services, encrypted persistence for consent and audit records, and centralized observability. The design deliberately avoids storing production customer data in the developer portal or sandbox. The sandbox uses synthetic data and deterministic test triggers so developers can test edge cases safely.

## Security Model Analysis

The authorization model starts with consent creation and then redirects the customer through an authorization server using Authorization Code with PKCE. PAR protects authorization parameters through a back-channel request, JARM signs the authorization response, and mTLS binds regulated clients to certificates. Access tokens are short-lived, scope-limited, audience-restricted, and linked to consent identifiers. Refresh tokens are rotated and revoked on consent revocation.

Threat mitigations include schema validation for injection, certificate validation for spoofing, state and PKCE for CSRF and code injection, idempotency keys for payment replay, and consent-to-token checks for scope escalation.

The security model separates authentication, authorization, consent, and policy enforcement. Authentication proves the identity of the TPP application and, where applicable, the customer. Authorization determines which scopes the TPP can request. Consent records what the customer allowed, for what purpose, and for how long. Policy enforcement happens at the gateway before traffic reaches the backend. Keeping these concepts separate prevents a common design flaw where a valid OAuth token is treated as enough evidence for all access.

OAuth 2.0 Authorization Code with PKCE is selected because it avoids exposing long-lived credentials in the browser and mitigates authorization code interception. PAR reduces front-channel leakage by pushing sensitive request parameters to the authorization server before redirecting the user. JARM protects the authorization response by returning signed response data. mTLS and certificate-bound tokens reduce replay risk because a stolen token is less useful without the corresponding private key.

Payment initiation receives additional protection. Payment APIs are state-changing and can create direct financial harm, so the design requires payment-specific consent, strong customer authentication, idempotency keys, and status polling. The payment consent resource records the instruction before the final submission call, allowing the customer to approve a specific amount and creditor rather than a vague payment permission.

The threat model is linked to operational controls. Injection and malformed requests are handled through OpenAPI validation. Token theft is reduced through short lifetimes and certificate binding. Consent escalation is controlled through consent-token binding. Replay attacks are reduced with signed authorization responses and idempotency keys. Insider misuse is mitigated by least privilege, audit logs, and separation between developer portal administration and core banking administration.

## Developer Experience Strategy

The portal is structured around onboarding, app registration, API reference, Getting Started, authentication, error reference, status, and support. The onboarding journey is designed to let a developer create an app, configure certificates, create sandbox consent, exchange a token, and make the first accounts call quickly.

The sandbox includes synthetic data, deterministic error injection, configurable latency concepts, and reset behaviour. The error reference uses stable machine-readable codes with causes and fixes so developers can debug without relying on support tickets for common failures.

The developer portal is designed as a guided product surface rather than a file listing. The homepage introduces API products and status. Registration captures application metadata and redirect URIs. The dashboard shows credentials, usage, rate limits, recent errors, and consent health. The API reference is generated from OpenAPI definitions and should support a "Try It" style sandbox interaction. The Getting Started guide gives cURL, Python, Node.js, and Java examples to reduce integration friction.

The sandbox is a selection differentiator because many API designs look complete on paper but fail when developers try realistic scenarios. This project documents synthetic customers, account states, transaction examples, payment outcomes, consent revocation, rate limits, and error injection. Deterministic triggers such as IDs beginning with `ERR`, `RATE`, or `REV` make it easy for a developer to reproduce failures and verify their error handling.

The error reference is also part of developer experience. Stable codes such as `CONSENT_REVOKED`, `INVALID_FAPI_HEADER`, and `RATE_LIMIT_EXCEEDED` are more useful than vague text messages. Each error includes an HTTP status, likely cause, fix, and correlation ID strategy. This reduces support load and improves integration quality.

## Governance Framework

Rate limiting uses token bucket controls with endpoint-specific tiers for accounts, payments, bulk operations, and events. Versioning uses URI major versions and metadata/changelog entries for non-breaking changes. Deprecation includes notice periods, headers, migration guidance, and final `410 Gone` enforcement. Monitoring covers request volume, latency, error rates, consent conversion, rate limit violations, payment failures, and TPP traffic concentration.

Governance matters because open banking APIs are long-lived public contracts. A technically functional endpoint can still create ecosystem risk if changes are unannounced, limits are unclear, or incident communication is weak. The versioning policy distinguishes breaking and non-breaking changes so developers can plan upgrades. The deprecation policy gives advance notice, migration links, and final enforcement behaviour. The rate limiting policy protects platform stability while explaining how legitimate TPPs can request higher quotas.

Monitoring is designed around both operations and regulation. Availability, latency, and 5xx error rates indicate platform reliability. Consent conversion highlights friction or authorization failures. Payment failure rate indicates financial workflow health. TPP distribution helps identify abuse, concentration risk, or a single client causing ecosystem-wide pressure. Rate limit metrics show whether quotas are fair or too restrictive.

Audit logging is treated as a regulatory capability. Each request should carry an interaction ID that can be followed through gateway logs, authorization decisions, consent checks, backend calls, and error responses. This helps support teams investigate incidents without exposing secrets or customer data in tickets.

## Limitations and Future Work

The repository is a design and simulation submission, not a production banking implementation. Future enhancements would include a runnable custom mock proxy for dynamic sandbox behaviour, generated developer documentation site, richer contract tests for all endpoints, production-grade certificate validation examples, and deeper conformance mapping to each jurisdiction's official test suites.

A second limitation is that official open banking standards are large and jurisdiction-specific. This submission intentionally focuses on the assessment's required 20 endpoints and common architecture/security patterns. A production programme would need exact conformance testing against the chosen jurisdiction, legal review of consent wording, privacy impact assessment, operational runbooks, and penetration testing.

Future work should prioritize evidence quality. The strongest next improvements would be generated HTML documentation from OpenAPI, Newman/Postman test runs in CI, Spectral custom rules for FAPI headers and error envelopes, a small mock middleware layer for deterministic error injection, and exported dashboard mockups for monitoring. These would move the project from design artefacts toward a demonstrable platform prototype.

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
