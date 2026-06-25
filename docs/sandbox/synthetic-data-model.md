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
