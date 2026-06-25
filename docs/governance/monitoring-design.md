# Monitoring Design

## Metrics

| Metric | Purpose | Alert |
| --- | --- | --- |
| Request count | Traffic visibility | Unexpected drop or spike |
| Latency P50/P95/P99 | Developer experience and SLA | P95 > 1.5s |
| Error rate | Reliability | 5xx > 0.5% |
| Consent conversion | UX and auth health | Sudden fall > 20% |
| TPP distribution | Abuse and business insight | Single TPP > 40% traffic |
| Payment failure rate | Payment health | Failure > 2% |
| Token endpoint failure rate | Auth health | 5xx > 0.3% or invalid_client spike |
| Consent revocation rate | Privacy and UX signal | Sudden unexplained increase |
| Rate limit violations | Capacity and abuse signal | TPP exceeds threshold repeatedly |
| Certificate expiry | Operational continuity | Certificate expires within 14 days |
| Sandbox reset usage | Developer behaviour | Reset failures or unusual spike |

## Tool Choice

Grafana with Prometheus is selected for the simulated implementation because it is widely used, portable, and easy to represent in architecture diagrams.

Prometheus collects time-series metrics from the gateway, authorization server, consent service, mock server, and backend domain services. Grafana displays dashboards for operations, developer experience, security, and business health. Logs are centralized separately because audit and trace data need richer context than metrics. Distributed tracing is recommended for end-to-end latency analysis across gateway validation, token checks, consent lookup, backend calls, and response transformation.

## Dashboard Panels

- API traffic by endpoint.
- Latency percentiles.
- Error rate by status code.
- Rate limit violations.
- Consent lifecycle funnel.
- Payment status distribution.
- Top TPPs by traffic.
- Token endpoint success and failure rates.
- Certificate expiry and mTLS failures.
- Sandbox errors by deterministic trigger.
- Developer portal onboarding completion.

## Alert Thresholds

| Alert | Threshold | Severity | Initial Owner |
| --- | --- | --- | --- |
| API availability drop | Availability below 99.5% for 10 minutes | Critical | API operations |
| High latency | P95 latency above 1.5 seconds for 15 minutes | High | API operations |
| Payment failures | Failed payment submissions above 2% for 10 minutes | Critical | Payments team |
| Authorization failures | Token endpoint 5xx above 0.3% for 10 minutes | High | Identity team |
| Consent conversion drop | Approval completion falls by 20% from baseline | Medium | Product and security |
| mTLS failure spike | Failed handshakes double baseline | High | Security operations |
| Rate limit abuse | Same TPP hits 429 threshold for 15 minutes | Medium | Developer support |
| Certificate expiry | Registered certificate expires within 14 days | Medium | Developer support |

## Alert Routing

Availability and payment failures page the API operations team immediately. Consent conversion drops notify product and security teams because the cause may be user experience friction, authorization server issues, or fraud controls. Repeated invalid certificate events notify security operations. Public incident updates are reflected on the developer portal status page.

## Logging and Trace Correlation

Every request should include or receive an `x-fapi-interaction-id`. The gateway writes this value into access logs, audit logs, traces, and error responses. Support teams can ask a developer for the interaction ID and then locate the exact request path without asking for access tokens or customer data. Logs should capture timestamp, client ID, endpoint, method, status, latency, consent ID reference, decision outcome, and sanitized error code.

Sensitive values must not be logged. Bearer tokens, refresh tokens, authorization codes, full account numbers, and private customer data are excluded or masked. This is especially important because logs are often viewed by operations and support teams who do not need full financial data.

## Incident Communication

The developer portal status page should show current component health, active incidents, maintenance windows, and historical availability. For major incidents, the bank should publish updates at fixed intervals, even if the update is only that investigation is ongoing. TPP technical contacts receive email or webhook notifications for incidents that affect production traffic, authorization, payment submission, or sandbox onboarding.

## Review Cadence

Operational dashboards are reviewed daily during launch and weekly after stabilization. Alert thresholds are tuned after observing real traffic because initial thresholds are estimates. Monthly governance reviews should inspect SLO compliance, top error codes, TPP traffic distribution, and repeated support themes.
