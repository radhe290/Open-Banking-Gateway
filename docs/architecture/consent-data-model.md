# Consent Data Model

## Consent Resource

```json
{
  "consentId": "cns_123456789",
  "status": "AwaitingAuthorisation",
  "permissions": [
    "ReadAccountsBasic",
    "ReadBalances",
    "ReadTransactionsDetail"
  ],
  "expirationDateTime": "2026-09-25T00:00:00Z",
  "transactionFromDateTime": "2026-01-01T00:00:00Z",
  "transactionToDateTime": "2026-06-25T00:00:00Z",
  "clientId": "tpp_client_001",
  "userId": "user_001",
  "createdAt": "2026-06-25T00:00:00Z",
  "updatedAt": "2026-06-25T00:00:00Z"
}
```

## Permissions Taxonomy

- `ReadAccountsBasic`
- `ReadAccountsDetail`
- `ReadBalances`
- `ReadTransactionsBasic`
- `ReadTransactionsDetail`
- `ReadBeneficiaries`
- `ReadStandingOrders`
- `ReadDirectDebits`
- `ReadProducts`

## Token Binding

Tokens must include a consent reference, allowed scopes, client identifier, expiry, and certificate confirmation claim. The gateway denies access when token scope and consent permissions do not both allow the requested operation.
