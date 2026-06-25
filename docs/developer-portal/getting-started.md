# Getting Started

## Goal

Make a first sandbox `GET /accounts` call in under 30 minutes using the simulated Meridian Bank developer portal.

## Steps

1. Create a developer account in the portal.
2. Register an application and select the sandbox environment.
3. Upload or generate sandbox certificates.
4. Create an account access consent.
5. Redirect the customer through the simulated authorization journey.
6. Exchange the authorization code for a consent-bound access token.
7. Call the accounts endpoint with FAPI headers.

## Create Consent

```bash
curl -X POST https://sandbox.meridian.example/v3.1/consents \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  -H "x-fapi-interaction-id: 7f6b4d34-0000-4000-9000-000000000001" \
  -H "x-fapi-financial-id: meridian-bank" \
  -H "x-idempotency-key: idem-001" \
  -H "Content-Type: application/json" \
  -d '{"permissions":["ReadAccountsBasic","ReadBalances"],"expirationDateTime":"2026-09-25T00:00:00Z"}'
```

## Python Example

```python
import requests

headers = {
    "Authorization": f"Bearer {ACCESS_TOKEN}",
    "x-fapi-interaction-id": "7f6b4d34-0000-4000-9000-000000000002",
    "x-fapi-financial-id": "meridian-bank"
}

response = requests.get("https://sandbox.meridian.example/v3.1/accounts", headers=headers)
print(response.json())
```

## Node.js Example

```javascript
const response = await fetch("https://sandbox.meridian.example/v3.1/accounts", {
  headers: {
    Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
    "x-fapi-interaction-id": "7f6b4d34-0000-4000-9000-000000000003",
    "x-fapi-financial-id": "meridian-bank"
  }
});

console.log(await response.json());
```

## Java Example

```java
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://sandbox.meridian.example/v3.1/accounts"))
    .header("Authorization", "Bearer " + accessToken)
    .header("x-fapi-interaction-id", "7f6b4d34-0000-4000-9000-000000000004")
    .header("x-fapi-financial-id", "meridian-bank")
    .GET()
    .build();
```

## Expected Response

```json
{
  "data": [
    {
      "accountId": "acc-1001",
      "currency": "GBP",
      "accountType": "CurrentAccount",
      "status": "Enabled",
      "nickname": "Everyday Account"
    }
  ],
  "links": {
    "self": "/v3.1/accounts"
  },
  "meta": {
    "total": 1
  }
}
```

## Portal Screens

The exported wireframes in `docs/developer-portal/wireframes/` cover homepage, onboarding, dashboard, API reference, Getting Started, and API status pages.
