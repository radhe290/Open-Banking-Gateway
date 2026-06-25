# Deprecation Policy

## Minimum Notice

Breaking API changes require at least six months of deprecation notice.

## Communication Channels

- Developer portal changelog.
- Email to registered technical contacts.
- API status page.
- Response headers.

## Headers

```http
Deprecation: true
Sunset: Sat, 25 Dec 2026 00:00:00 GMT
Link: <https://developer.example.com/migration/v3-to-v4>; rel="deprecation"
```

## Enforcement

After sunset, retired endpoints return `410 Gone` with a link to migration documentation.
