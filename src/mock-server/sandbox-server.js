const http = require('http');
const { randomUUID } = require('crypto');

const port = Number(process.env.PORT || 4020);

const accounts = [
  {
    accountId: 'acc-1001',
    currency: 'INR',
    accountType: 'Current',
    nickname: 'Primary current account',
    status: 'Enabled'
  },
  {
    accountId: 'acc-2002',
    currency: 'GBP',
    accountType: 'Savings',
    nickname: 'Travel savings',
    status: 'Enabled'
  }
];

const balances = [
  {
    accountId: 'acc-1001',
    type: 'InterimAvailable',
    amount: { currency: 'INR', value: '152340.25' },
    creditDebitIndicator: 'Credit'
  }
];

const transactions = [
  {
    transactionId: 'txn-9001',
    amount: { currency: 'INR', value: '2500.00' },
    creditDebitIndicator: 'Debit',
    status: 'Booked',
    bookingDateTime: '2026-06-25T10:30:00Z',
    description: 'Utility bill payment'
  },
  {
    transactionId: 'txn-9002',
    amount: { currency: 'INR', value: '75000.00' },
    creditDebitIndicator: 'Credit',
    status: 'Booked',
    bookingDateTime: '2026-06-24T09:00:00Z',
    description: 'Salary credit'
  }
];

const eventTypes = [
  'urn:bank:events:consent-revoked',
  'urn:bank:events:payment-status-changed',
  'urn:bank:events:account-access-consent-linked'
];

function sendJson(res, statusCode, body, headers = {}) {
  res.writeHead(statusCode, {
    'content-type': 'application/json',
    'x-fapi-interaction-id': headers.interactionId || randomUUID(),
    ...headers
  });
  res.end(JSON.stringify(body, null, 2));
}

function sendEmpty(res, statusCode, headers = {}) {
  res.writeHead(statusCode, {
    'x-fapi-interaction-id': headers.interactionId || randomUUID(),
    ...headers
  });
  res.end();
}

function errorBody(code, message) {
  return {
    error: {
      code,
      message,
      traceId: randomUUID()
    }
  };
}

function readBody(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => {
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve({});
      }
    });
  });
}

function stripVersion(pathname) {
  return pathname.replace(/^\/v\d+(\.\d+)?/, '') || '/';
}

function pathParts(pathname) {
  return stripVersion(pathname).split('/').filter(Boolean);
}

function hasAmount(body, value) {
  const amount = body.instructedAmount || body.data?.instructedAmount || body.payment?.instructedAmount;
  return amount && Number(amount.value) === value;
}

function triggerIfNeeded(req, res, parts, body, interactionId) {
  const accountIndex = parts.indexOf('accounts');
  const consentIndex = parts.findIndex((part) => part.endsWith('consents') || part === 'consents');

  if (accountIndex >= 0 && parts[accountIndex + 1]?.startsWith('ERR')) {
    sendJson(res, 500, errorBody('INTERNAL_ERROR', 'Synthetic internal error for sandbox testing.'), { interactionId });
    return true;
  }

  if (accountIndex >= 0 && parts[accountIndex + 1]?.startsWith('RATE')) {
    sendJson(
      res,
      429,
      errorBody('RATE_LIMIT_EXCEEDED', 'Synthetic rate limit response for sandbox testing.'),
      { interactionId, 'retry-after': '60', 'x-ratelimit-limit': '300', 'x-ratelimit-remaining': '0' }
    );
    return true;
  }

  if (consentIndex >= 0 && parts[consentIndex + 1]?.startsWith('REV')) {
    sendJson(res, 403, errorBody('CONSENT_REVOKED', 'Synthetic revoked consent response.'), { interactionId });
    return true;
  }

  if (req.method === 'POST' && hasAmount(body, 13.37)) {
    sendJson(res, 422, errorBody('PAYMENT_RISK_REJECTED', 'Synthetic fraud rejection for payment amount 13.37.'), {
      interactionId
    });
    return true;
  }

  return false;
}

function accountResponse(accountId) {
  return accounts.find((account) => account.accountId === accountId) || { ...accounts[0], accountId };
}

async function route(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const parts = pathParts(url.pathname);
  const body = await readBody(req);
  const interactionId = req.headers['x-fapi-interaction-id'] || randomUUID();

  if (triggerIfNeeded(req, res, parts, body, interactionId)) {
    return;
  }

  if (req.method === 'GET' && parts.join('/') === 'health') {
    sendJson(res, 200, { status: 'ok', service: 'open-banking-sandbox' }, { interactionId });
    return;
  }

  if (req.method === 'POST' && parts[0] === 'consents' && parts.length === 1) {
    sendJson(res, 201, {
      consentId: 'con-1001',
      status: 'AwaitingAuthorisation',
      permissions: body.permissions || ['ReadAccountsBasic', 'ReadBalances', 'ReadTransactionsBasic'],
      expirationDateTime: '2026-12-31T23:59:59Z'
    }, { interactionId });
    return;
  }

  if (req.method === 'GET' && parts[0] === 'consents' && parts[1]) {
    sendJson(res, 200, {
      consentId: parts[1],
      status: 'Authorised',
      permissions: ['ReadAccountsBasic', 'ReadBalances', 'ReadTransactionsBasic'],
      expirationDateTime: '2026-12-31T23:59:59Z'
    }, { interactionId });
    return;
  }

  if (req.method === 'DELETE' && parts[0] === 'consents' && parts[1]) {
    sendEmpty(res, 204, { interactionId });
    return;
  }

  if (req.method === 'GET' && parts[0] === 'accounts' && parts.length === 1) {
    sendJson(res, 200, {
      data: accounts,
      links: { self: `${url.origin}${url.pathname}` },
      meta: { total: accounts.length }
    }, { interactionId });
    return;
  }

  if (req.method === 'GET' && parts[0] === 'accounts' && parts[1] && parts.length === 2) {
    sendJson(res, 200, { data: accountResponse(parts[1]) }, { interactionId });
    return;
  }

  if (req.method === 'GET' && parts[0] === 'accounts' && parts[2] === 'balances') {
    sendJson(res, 200, { data: balances.map((balance) => ({ ...balance, accountId: parts[1] })) }, { interactionId });
    return;
  }

  if (req.method === 'GET' && parts[0] === 'accounts' && parts[2] === 'transactions') {
    sendJson(res, 200, {
      data: transactions,
      links: { self: `${url.origin}${url.pathname}`, next: null },
      meta: { total: transactions.length }
    }, { interactionId });
    return;
  }

  if (req.method === 'GET' && parts[0] === 'accounts' && parts[2] === 'beneficiaries') {
    sendJson(res, 200, { data: [{ beneficiaryId: 'ben-1001', name: 'Meridian Utilities' }] }, { interactionId });
    return;
  }

  if (req.method === 'GET' && parts[0] === 'accounts' && parts[2] === 'standing-orders') {
    sendJson(res, 200, { data: [{ standingOrderId: 'so-1001', frequency: 'Monthly', status: 'Active' }] }, { interactionId });
    return;
  }

  if (req.method === 'GET' && parts[0] === 'accounts' && parts[2] === 'direct-debits') {
    sendJson(res, 200, { data: [{ directDebitId: 'dd-1001', merchantName: 'Insurance Co', status: 'Active' }] }, { interactionId });
    return;
  }

  if (req.method === 'POST' && parts[0]?.endsWith('payment-consents') && parts.length === 1) {
    sendJson(res, 201, {
      consentId: parts[0].startsWith('international') ? 'ipcon-1001' : 'dpcon-1001',
      status: 'AwaitingAuthorisation',
      charges: [],
      risk: body.risk || { paymentContextCode: 'BillPayment' }
    }, { interactionId });
    return;
  }

  if (req.method === 'GET' && parts[0]?.endsWith('payment-consents') && parts[1]) {
    sendJson(res, 200, { consentId: parts[1], status: 'Authorised' }, { interactionId });
    return;
  }

  if (req.method === 'POST' && parts[0]?.endsWith('payments') && parts.length === 1) {
    sendJson(res, 201, {
      paymentId: parts[0].startsWith('international') ? 'ipay-1001' : 'dpay-1001',
      consentId: body.consentId || 'dpcon-1001',
      status: 'AcceptedSettlementInProcess'
    }, { interactionId });
    return;
  }

  if (req.method === 'GET' && parts[0]?.endsWith('payments') && parts[1]) {
    sendJson(res, 200, { paymentId: parts[1], status: 'AcceptedSettlementCompleted' }, { interactionId });
    return;
  }

  if (req.method === 'POST' && parts[0] === 'event-subscriptions') {
    sendJson(res, 201, {
      subscriptionId: 'sub-1001',
      callbackUrl: body.callbackUrl || 'https://tpp.example/callback',
      eventTypes
    }, { interactionId });
    return;
  }

  if (req.method === 'GET' && parts[0] === 'event-subscriptions' && parts[1]) {
    sendJson(res, 200, { subscriptionId: parts[1], eventTypes, status: 'Active' }, { interactionId });
    return;
  }

  if (req.method === 'DELETE' && parts[0] === 'event-subscriptions' && parts[1]) {
    sendEmpty(res, 204, { interactionId });
    return;
  }

  if (req.method === 'POST' && parts[0] === 'events') {
    sendJson(res, 200, {
      data: [
        {
          eventId: 'evt-1001',
          eventType: 'urn:bank:events:payment-status-changed',
          resourceId: 'dpay-1001',
          eventDateTime: '2026-06-26T12:00:00Z'
        }
      ]
    }, { interactionId });
    return;
  }

  sendJson(res, 404, errorBody('RESOURCE_NOT_FOUND', `No sandbox route matched ${req.method} ${url.pathname}.`), {
    interactionId
  });
}

if (require.main === module) {
  const server = http.createServer((req, res) => {
    route(req, res).catch((error) => {
      sendJson(res, 500, errorBody('INTERNAL_ERROR', error.message));
    });
  });

  server.listen(port, () => {
    console.log(`Open banking sandbox mock listening on http://localhost:${port}/v3.1`);
  });
}

module.exports = { route };
