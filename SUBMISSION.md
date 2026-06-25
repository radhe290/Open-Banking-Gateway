# Submission Narrative

## Candidate Details

- Name: Radhika Dwivedi
- Email: dwivediradhika29@gmail.com
- Project Code: P01D
- Repository URL: https://github.com/radhe290/Open-Banking-Gateway.git

## Project Approach

I approached the project as a platform design exercise rather than only an API documentation task. The first step was to map the expectations of PSD2, UK Open Banking, India's Account Aggregator framework, and Australia CDR into concrete design constraints: consent must be explicit and auditable, API access must be strongly authenticated, third-party developers need predictable documentation, and operational controls such as monitoring, throttling, and deprecation must be designed from the beginning.

The architecture work used a federated gateway-by-domain model for accounts, payments, consents, and events. That decision separates different risk profiles while keeping common controls such as OAuth validation, mTLS enforcement, request validation, rate limiting, audit logging, and observability consistent. The security design then expanded this into OAuth 2.0 Authorization Code with PKCE, FAPI-aligned controls including PAR and JARM, certificate-bound tokens, and consent-to-token binding.

The OpenAPI specifications were split by API domain to avoid a monolithic specification. Each API file includes paths, schemas, examples, security schemes, common headers, and reusable response structures. Spectral linting is configured locally and in GitHub Actions so that the specifications can be validated repeatedly as they evolve.

The developer portal and sandbox artefacts focus on developer experience: onboarding flow, authentication guide, error reference, status/API reference pages, synthetic data, error injection, and reset behaviour. Governance documents cover rate limiting, versioning, deprecation, monitoring, and operational response so the submission reflects the full API platform lifecycle rather than only launch-day design.

## Design Decision Log

| Decision | Selected Option | Alternatives Considered | Rationale |
| --- | --- | --- | --- |
| Gateway pattern | Federated gateway by API domain | Centralized gateway, BFF-only gateway | Balances isolation, regulatory controls, and operational clarity for accounts/payments/consents/events. |
| API format | OpenAPI 3.0.3 | AsyncAPI only, custom Markdown docs | OpenAPI is required by the brief and supports linting, contract tests, mocks, and developer docs. |
| Rate limiting | Token bucket with endpoint tiers | Fixed window, sliding log | Allows bursts while preserving predictable per-TPP quotas. |
| Versioning | URI major version plus semantic minor metadata | Header-only versioning | Clear for third-party developers and compatible with open banking examples. |

## Challenges Encountered

The main challenge was balancing regulatory security depth with developer usability. FAPI controls such as mTLS, PAR, JARM, and certificate-bound tokens improve assurance, but they also create onboarding complexity. The design addresses this by making the sandbox and portal explain the flow step by step, with required headers, examples, and troubleshooting.

Another challenge was keeping the OpenAPI specifications consistent across domains. Accounts, consents, payments, and events have different behaviours, but developers should see the same error envelope, pagination approach, FAPI headers, and security expectations. Reusable components and Spectral linting reduce this inconsistency risk.

The final challenge was avoiding a shallow architecture-only submission. The brief asks for a complete platform view, so the repository includes not just API paths but also consent lifecycle, gateway topology, threat model, monitoring, governance, mock server design, Postman requests, and portal wireframes.

## AI Tools Usage Disclosure

AI assistance was used for project planning, documentation drafting, consistency checks, and identifying submission gaps against the brief. The final artefacts were reviewed and adjusted to match the project scope, repository structure, OpenAPI linting requirements, and required submission checklist.

## Self Assessment

| Dimension | Self Score | Evidence |
| --- | --- | --- |
| Problem Understanding | 8/10 | Regulatory comparison, endpoint coverage, standards mapping |
| Solution Quality | 8/10 | Architecture, OpenAPI specs, security model |
| Research & Analysis | 7/10 | Standards references and technical report |
| Presentation & Clarity | 8/10 | README, diagrams, developer portal docs |
| Innovation & Creativity | 8/10 | Sandbox simulation and portal flows |
| Feasibility & Practicality | 8/10 | Mock server, governance, monitoring |
| CV Alignment | 8/10 | API platform engineering artefacts |

