const fs = require('fs');
const path = require('path');

const collectionPath = path.join(__dirname, '..', '..', 'src', 'postman-collections', 'openbanking.postman_collection.json');
const collection = JSON.parse(fs.readFileSync(collectionPath, 'utf8'));

const requests = [];

function walk(items) {
  for (const item of items || []) {
    if (item.request) {
      requests.push(item);
    }
    walk(item.item);
  }
}

walk(collection.item);

const requiredVariables = ['baseUrl', 'productionBaseUrl', 'accessToken', 'financialId'];
const variables = new Set((collection.variable || []).map((variable) => variable.key));
const missingVariables = requiredVariables.filter((variable) => !variables.has(variable));

const hasCollectionTests = (collection.event || []).some((event) => {
  const script = (event.script?.exec || []).join('\n');
  return event.listen === 'test' && script.includes('response is valid JSON') && script.includes('error response uses shared envelope');
});

const postRequestsWithoutIdempotency = requests.filter((item) => {
  const method = item.request.method;
  const headers = item.request.header || [];
  return method === 'POST' && !headers.some((header) => header.key.toLowerCase() === 'x-idempotency-key');
});

const failures = [];
if (requests.length < 22) {
  failures.push(`Expected at least 22 requests, found ${requests.length}.`);
}
if (missingVariables.length) {
  failures.push(`Missing collection variables: ${missingVariables.join(', ')}.`);
}
if (!hasCollectionTests) {
  failures.push('Missing collection-level tests for JSON responses and shared error envelope.');
}
if (postRequestsWithoutIdempotency.length) {
  failures.push(`POST requests missing x-idempotency-key: ${postRequestsWithoutIdempotency.map((item) => item.name).join(', ')}.`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Postman collection validation passed with ${requests.length} requests.`);
