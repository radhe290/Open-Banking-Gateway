# Security Architecture

## Overview

The security model combines OAuth 2.0 Authorization Code Flow with PKCE, FAPI-aligned controls, mTLS, signed authorization requests, consent-bound tokens, and detailed audit logging.

## Authorization Code with PKCE

```mermaid
sequenceDiagram
  participant TPP
  participant Gateway
  participant Consent as Consent Service
  participant AS as Authorization Server
  participant User
  TPP->>Gateway: POST /consents
  Gateway->>Consent: Create consent
  Consent-->>Gateway: ConsentId, AwaitingAuthorisation
  Gateway-->>TPP: 201 Created
  TPP->>AS: /authorize with client_id, scope, state, PKCE, request object
  AS->>User: Authenticate and approve consent
  User-->>AS: Approval
  AS-->>TPP: Authorization code
  TPP->>AS: Token request with code_verifier over mTLS
  AS-->>TPP: Access token bound to consent and certificate
  TPP->>Gateway: GET /accounts with Bearer token
  Gateway->>Gateway: Validate token, scope, consent, certificate
```

## FAPI 1.0 Advanced Controls

| Control | Design Treatment |
| --- | --- |
| mTLS | Required for token endpoint and high-risk API calls. |
| PKCE | Required for authorization code flow. |
| PAR | Authorization parameters pushed through back channel. |
| JARM | Authorization response returned as signed JWT. |
| Signed request object | Prevents front-channel tampering. |
| Certificate-bound tokens | Reduces replay risk if token is stolen. |

## Token Lifecycle

- Access tokens: short lived, consent-bound, scope-limited.
- Refresh tokens: rotated on use and revoked when consent is revoked.
- ID tokens: issued only where OIDC identity context is needed.
- Revocation: triggered by customer action, TPP deregistration, fraud event, or expiry.

## Certificate Management

- PSD2: eIDAS QWAC/QSEAL concepts.
- UK Open Banking: OBWAC/OBSEAL concepts.
- Australia CDR: register-backed certificates.
- Platform rule: all certificates are validated against trusted directories and revocation status.

## Consent States

```mermaid
stateDiagram-v2
  [*] --> AwaitingAuthorisation
  AwaitingAuthorisation --> Authorised
  AwaitingAuthorisation --> Rejected
  Authorised --> Revoked
  Authorised --> Expired
  Revoked --> [*]
  Rejected --> [*]
  Expired --> [*]
```

## Payment Initiation Flow

```mermaid
sequenceDiagram
  participant TPP
  participant Gateway
  participant Consent as Payment Consent Service
  participant AS as Authorization Server
  participant User
  participant Payments
  TPP->>Gateway: POST /domestic-payment-consents
  Gateway->>Consent: Validate and store payment instruction
  Consent-->>Gateway: Payment consent AwaitingAuthorisation
  Gateway-->>TPP: 201 Created
  TPP->>AS: PAR + signed request object for payment consent
  AS->>User: Strong customer authentication and payment approval
  User-->>AS: Approval
  AS-->>TPP: JARM authorization response
  TPP->>AS: Token request over mTLS with PKCE verifier
  AS-->>TPP: Consent-bound access token
  TPP->>Gateway: POST /domestic-payments with x-idempotency-key
  Gateway->>Payments: Submit authorized payment
  Payments-->>Gateway: PaymentId and status
  Gateway-->>TPP: 201 Created
```

## Consent Revocation Flow

```mermaid
sequenceDiagram
  participant User
  participant Portal as Bank Consent Dashboard
  participant Consent
  participant AS as Authorization Server
  participant Events
  participant TPP
  User->>Portal: Revoke consent
  Portal->>Consent: Mark consent Revoked
  Consent->>AS: Revoke refresh and access tokens
  Consent->>Events: Publish consent-revoked event
  Events-->>TPP: Event notification / polling response
  TPP->>Gateway: Later API call with old token
  Gateway-->>TPP: 403 consent_revoked
```

## Threat Model Linkage

The threat model focuses on ten risks called out in the brief: injection, broken authentication, excessive data exposure, rate limiting bypass, consent scope escalation, token theft, certificate spoofing, replay attacks, CSRF in the consent flow, and insider threat. The security architecture mitigates these through OpenAPI validation, PKCE, mTLS, PAR, JARM, signed request objects, certificate-bound access tokens, least-privilege scopes, consent-to-token binding, and immutable audit logs.

## Operational Security Rules

- Authorization codes are single-use and expire quickly.
- Access tokens are short-lived and audience-restricted to the resource APIs.
- Refresh tokens are rotated and revoked on consent revocation.
- Payment submission requires an active payment consent and idempotency key.
- Redirect URIs must exactly match registered application metadata.
- All security decisions are logged with `x-fapi-interaction-id`.
- Certificate revocation status is checked during client authentication.
