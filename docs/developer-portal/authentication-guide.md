# Authentication Guide

## Overview

The platform uses OAuth 2.0 Authorization Code Flow with PKCE and FAPI-aligned controls.

## Certificate Generation for Sandbox

```bash
openssl req -newkey rsa:2048 -nodes -keyout sandbox-client.key -x509 -days 365 -out sandbox-client.crt
```

## Authorization Flow

1. TPP creates consent.
2. TPP builds a signed request object.
3. TPP pushes request using PAR.
4. Customer authenticates and approves.
5. Authorization server returns signed response.
6. TPP exchanges code for token over mTLS.
7. TPP calls resource endpoint with access token.

## Troubleshooting

| Error | Likely Cause | Fix |
| --- | --- | --- |
| `invalid_client` | Certificate or client ID mismatch | Verify registered certificate thumbprint |
| `invalid_grant` | Code expired or reused | Restart authorization flow |
| `insufficient_scope` | Token lacks required scope | Request consent with correct permission |
| `consent_revoked` | Customer revoked access | Ask customer to re-authorize |
