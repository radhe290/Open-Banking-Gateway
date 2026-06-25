# Submission Narrative

## Candidate Details

- Name: TODO
- Intern ID: TODO
- Email: TODO
- Project Code: P01D
- Repository URL: TODO

## Project Approach

TODO: In 3-5 paragraphs, explain how you approached the project. Mention the order in which you worked: regulatory research, architecture, security, OpenAPI specs, developer portal, sandbox, governance, and final validation.

## Design Decision Log

| Decision | Selected Option | Alternatives Considered | Rationale |
| --- | --- | --- | --- |
| Gateway pattern | Federated gateway by API domain | Centralized gateway, BFF-only gateway | Balances isolation, regulatory controls, and operational clarity for accounts/payments/consents/events. |
| API format | OpenAPI 3.0.3 | AsyncAPI only, custom Markdown docs | OpenAPI is required by the brief and supports linting, contract tests, mocks, and developer docs. |
| Rate limiting | Token bucket with endpoint tiers | Fixed window, sliding log | Allows bursts while preserving predictable per-TPP quotas. |
| Versioning | URI major version plus semantic minor metadata | Header-only versioning | Clear for third-party developers and compatible with open banking examples. |

## Challenges Encountered

TODO: Add real challenges you faced. Examples: understanding FAPI terminology, designing schemas consistently, balancing developer experience with compliance, or validating OpenAPI YAML.

## AI Tools Usage Disclosure

TODO: Disclose exactly how AI helped. Example: "AI assistance was used for planning, drafting templates, and checking consistency. I reviewed, edited, and validated the final artefacts."

## Self Assessment

| Dimension | Self Score | Evidence |
| --- | --- | --- |
| Problem Understanding | TODO | Regulatory comparison, endpoint coverage, standards mapping |
| Solution Quality | TODO | Architecture, OpenAPI specs, security model |
| Research & Analysis | TODO | Citations in technical report |
| Presentation & Clarity | TODO | README, diagrams, developer portal docs |
| Innovation & Creativity | TODO | Sandbox simulation and portal flows |
| Feasibility & Practicality | TODO | Mock server, governance, monitoring |
| CV Alignment | TODO | API platform engineering artefacts |

## Final Checks

- [ ] All TODO markers removed or intentionally completed.
- [ ] OpenAPI specs linted.
- [ ] Wireframes exported to PNG.
- [ ] Postman collection committed.
- [ ] No secrets or personal credentials committed.
- [ ] Final git tag created.
