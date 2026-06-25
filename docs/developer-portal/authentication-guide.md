# Authentication Guide

## Overview

The platform uses OAuth 2.0 Authorization Code Flow with PKCE and FAPI-aligned controls.

## Certificate Generation for Sandbox

```bash
openssl req -newkey rsa:2048 -nodes -keyout sandbox-client.key -x509 -days 365 -out sandbox-client.crt
```

The sandbox certificate is self-signed for simulation only. In production, regulated TPPs would use certificates anchored in the relevant trust framework, such as eIDAS certificates for PSD2, OBWAC/OBSEAL-style certificates for UK Open Banking, or register-backed CDR certificates in Australia.

## Authorization Flow

1. TPP creates consent.
2. TPP builds a signed request object.
3. TPP pushes request using PAR.
4. Customer authenticates and approves.
5. Authorization server returns signed response.
6. TPP exchanges code for token over mTLS.
7. TPP calls resource endpoint with access token.

## Required API Headers

| Header | Required For | Purpose |
| --- | --- | --- |
| `Authorization` | All protected APIs | Bearer access token |
| `x-fapi-interaction-id` | All APIs | End-to-end correlation and audit |
| `x-fapi-financial-id` | All APIs | Identifies the financial institution/API brand |
| `x-idempotency-key` | POST consent/payment APIs | Prevents duplicate state-changing requests |

## Security Checklist

- Use Authorization Code with PKCE for customer authorization.
- Use PAR to push sensitive authorization details through the back channel.
- Use JARM to protect authorization responses.
- Bind tokens to the client certificate where mTLS is required.
- Validate token scope and consent permissions before every resource call.
- Rotate refresh tokens and revoke them immediately when consent is revoked.

## Troubleshooting

| Error | Likely Cause | Fix |
| --- | --- | --- |
| `invalid_client` | Certificate or client ID mismatch | Verify registered certificate thumbprint |
| `invalid_grant` | Code expired or reused | Restart authorization flow |
| `insufficient_scope` | Token lacks required scope | Request consent with correct permission |
| `consent_revoked` | Customer revoked access | Ask customer to re-authorize |
