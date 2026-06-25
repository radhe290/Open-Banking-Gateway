# Threat Model

This model uses STRIDE-style thinking and focuses on the gateway, authorization server, consent service, and developer-facing APIs.

| Threat | STRIDE Category | Likelihood | Impact | Mitigation | Detection | Residual Risk |
| --- | --- | --- | --- | --- | --- | --- |
| Injection through path, query, or JSON payloads | Tampering | Medium | High | OpenAPI validation, strict content types, schema constraints, parameterized backend queries | 400 spikes, WAF alerts, validator rejection logs | Low |
| Broken authentication or weak client verification | Spoofing | Medium | Critical | OAuth 2.0 Authorization Code with PKCE, mTLS for regulated clients, exact redirect URI matching | Failed token exchange metrics, invalid client alerts | Medium |
| Excessive data exposure beyond consent scope | Information Disclosure | Medium | High | Response minimization, consent-scoped fields, field-level authorization | Audit comparison of endpoint, token scope, and response type | Medium |
| Rate limit bypass by rotating credentials or endpoints | Denial of Service | Medium | High | Per-client, per-certificate, per-endpoint, and global limits with anomaly detection | Rate limit dashboard and TPP distribution alerts | Medium |
| Consent scope escalation | Elevation of Privilege | Medium | Critical | Consent-token binding, immutable consent permissions, policy check before routing | Consent permission mismatch alerts | Low |
| Access token theft | Spoofing | Medium | Critical | Short-lived tokens, certificate-bound tokens, audience restriction, refresh token rotation | Token reuse from unexpected certificate or IP | Medium |
| Certificate spoofing or expired trust anchors | Spoofing | Low | Critical | Trusted directory validation, certificate chain checks, revocation checks | mTLS handshake failures and certificate expiry alerts | Low |
| Replay attacks against payment submission | Repudiation/Tampering | Medium | High | TLS, nonce/state, JARM, signed request objects, `x-idempotency-key` deduplication | Duplicate idempotency key and timestamp drift alerts | Low |
| CSRF or authorization response injection in consent flow | Tampering | Medium | High | `state`, PKCE verifier, JARM, PAR, exact redirect URI validation | Failed state validation and redirect mismatch metrics | Low |
| Insider misuse of logs, credentials, or consent data | Information Disclosure/Elevation | Low | Critical | Least privilege, separation of duties, encrypted logs, approval workflows | Privileged action audit and access review reports | Medium |

## Risk Treatment

Critical risks are treated with preventive controls at the gateway and authorization server rather than relying only on monitoring. Medium residual risks remain where the platform depends on third-party operational hygiene, such as secure handling of client credentials and certificates by TPPs. These are reduced through onboarding checks, sandbox conformance tests, and production access reviews.
