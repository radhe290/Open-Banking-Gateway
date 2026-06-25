# Synthetic Data Model

## Customer

- `customerId`
- `name`
- `segment`
- `riskProfile`

## Account

- `accountId`
- `customerId`
- `accountType`
- `currency`
- `nickname`
- `status`

## Transaction

- `transactionId`
- `accountId`
- `bookingDateTime`
- `amount`
- `creditDebitIndicator`
- `merchantCategoryCode`
- `description`

## Payment

- `paymentId`
- `consentId`
- `status`
- `instructedAmount`
- `debtorAccount`
- `creditorAccount`

## Event

- `eventId`
- `eventType`
- `resourceId`
- `createdAt`
- `subscriptionId`

## Seed Profiles

The sandbox includes happy-path retail customers, SME profiles, empty-account customers, revoked-consent examples, and payment rejection cases. These profiles let developers test normal integration paths and operational edge cases before requesting production access.
