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

## Tool Choice

Grafana with Prometheus is selected for the simulated implementation because it is widely used, portable, and easy to represent in architecture diagrams.

## Dashboard Panels

- API traffic by endpoint.
- Latency percentiles.
- Error rate by status code.
- Rate limit violations.
- Consent lifecycle funnel.
- Payment status distribution.
- Top TPPs by traffic.
