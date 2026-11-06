'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const http = require('http');
const path = require('path');
const { resolveParentsHub, listen } = require('./serve');

test('parents-hub resolves only the magazine page, its CSS, and the publisher', () => {
  assert.equal(resolveParentsHub('/parents-hub').file, 'index.html');
  assert.equal(resolveParentsHub('/parents-hub/').file, 'index.html');
  assert.equal(resolveParentsHub('/parents-hub/magazine.css').file, 'magazine.css');
  assert.equal(resolveParentsHub('/parents-hub/publisher.js').file, 'publisher.js');
  assert.equal(resolveParentsHub('/magazine.css').file, 'magazine.css');
  assert.equal(resolveParentsHub('/publisher.js').file, 'publisher.js');
  assert.equal(resolveParentsHub('/parents-hub/../package.json'), null);
  assert.equal(resolveParentsHub('/api/programs'), null);
  assert.equal(resolveParentsHub('/%2e%2e/package.json'), null);
});

test('the server reads the magazine and refuses other methods', async () => {
  const server = await listen(0, '127.0.0.1');
  const { port } = server.address();
  try {
    const page = await fetch('http://127.0.0.1:' + port + '/parents-hub');
    const html = await page.text();
    assert.equal(page.status, 200);
    assert.match(page.headers.get('content-type'), /text\/html/);
    assert.match(html, /id="primary-identity"/);

    const css = await fetch('http://127.0.0.1:' + port + '/magazine.css');
    assert.equal(css.status, 200);
    assert.match(await css.text(), /--paper/);

    const publisher = await fetch('http://127.0.0.1:' + port + '/parents-hub/publisher.js');
    assert.equal(publisher.status, 200);
    assert.match(await publisher.text(), /publishForFamilies/);

    const denied = await fetch('http://127.0.0.1:' + port + '/parents-hub', { method: 'POST' });
    assert.equal(denied.status, 405);

    const missing = await fetch('http://127.0.0.1:' + port + '/parents-hub/secret');
    assert.equal(missing.status, 404);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('serve.js does not write and does not call the CMS', () => {
  const source = fs.readFileSync(path.join(__dirname, 'serve.js'), 'utf8');
  assert.equal(/\b(POST|PUT|PATCH|DELETE)\b/.test(source), false);
  assert.equal(/strapi/i.test(source), false);
  assert.equal(/fs\.write|appendFile|unlink|rmdir/.test(source), false);
});
