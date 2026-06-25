# Threat Model

| Threat | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| Injection | Medium | High | OpenAPI validation, allowlists, parameterized backend queries |
| Broken authentication | Medium | Critical | OAuth 2.0 with PKCE, mTLS, token validation |
| Excessive data exposure | Medium | High | Response minimization, consent-scoped fields |
| Rate limit bypass | Medium | High | Per-client, per-endpoint, and global limits |
| Consent scope escalation | Medium | Critical | Consent-token binding and policy checks |
| Token theft | Medium | Critical | Short-lived tokens and certificate binding |
| Certificate spoofing | Low | Critical | Trust store validation and revocation checks |
| Replay attacks | Medium | High | TLS, nonce/state, JARM, idempotency keys |
| CSRF in consent flow | Medium | High | State parameter, redirect URI validation, PKCE |
| Insider threat | Low | Critical | Least privilege, audit logs, approval workflows |

## TODO

Expand each row into STRIDE-style analysis with detection controls and residual risk.
