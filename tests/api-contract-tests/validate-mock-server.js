const http = require('http');
const { route } = require('../../src/mock-server/sandbox-server');

function request(server, method, path, body) {
  const address = server.address();
  const payload = body ? JSON.stringify(body) : undefined;

  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: address.port,
        method,
        path,
        headers: {
          authorization: 'Bearer test-token',
          'content-type': 'application/json',
          'x-fapi-financial-id': 'meridian-bank',
          'x-fapi-interaction-id': '00000000-0000-4000-8000-000000000001',
          ...(payload ? { 'content-length': Buffer.byteLength(payload) } : {})
        }
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => {
          raw += chunk;
        });
        res.on('end', () => {
          resolve({ statusCode: res.statusCode, body: raw ? JSON.parse(raw) : undefined });
        });
      }
    );

    req.on('error', reject);
    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

async function main() {
  const server = http.createServer((req, res) => route(req, res));
  await new Promise((resolve) => server.listen(0, resolve));

  try {
    const cases = [
      ['GET', '/v3.1/accounts', undefined, 200],
      ['GET', '/v3.1/accounts/ERR-1001', undefined, 500],
      ['GET', '/v3.1/accounts/RATE-1001', undefined, 429],
      ['GET', '/v3.1/consents/REV-1001', undefined, 403],
      ['POST', '/v3.1/domestic-payments', { instructedAmount: { currency: 'INR', value: '13.37' } }, 422],
      ['POST', '/v3.1/events', {}, 200]
    ];

    for (const [method, path, body, expectedStatus] of cases) {
      const response = await request(server, method, path, body);
      if (response.statusCode !== expectedStatus) {
        throw new Error(`${method} ${path} expected ${expectedStatus}, received ${response.statusCode}`);
      }
    }

    console.log('Sandbox mock server validation passed.');
  } finally {
    server.close();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
