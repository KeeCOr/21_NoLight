'use strict';
const net  = require('net');
const fs   = require('fs');
const os   = require('os');
const path = require('path');
const { start, stop } = require('../src/staticServer');

let tmpDir;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'inkwarrior-'));
});

afterEach(async () => {
  await stop();
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

// Generic raw HTTP request helper (not http.get) so we control the exact
// request-target bytes sent on the wire, including malformed/percent-encoded
// paths that Node's higher-level http client would reject or re-encode.
function rawRequest(port, method, rawTarget) {
  return new Promise((resolve, reject) => {
    const socket = net.connect(port, '127.0.0.1', () => {
      socket.write(`${method} ${rawTarget} HTTP/1.1\r\nHost: 127.0.0.1\r\nConnection: close\r\n\r\n`);
    });
    const chunks = [];
    socket.on('data', d => chunks.push(d));
    socket.on('error', reject);
    socket.on('end', () => {
      const raw = Buffer.concat(chunks);
      const headerEnd = raw.indexOf('\r\n\r\n');
      if (headerEnd === -1) {
        resolve({ status: 0, headers: {}, body: '' });
        return;
      }
      const headerPart = raw.slice(0, headerEnd).toString('utf8');
      const bodyPart = raw.slice(headerEnd + 4);
      const lines = headerPart.split('\r\n');
      const status = parseInt(lines[0].split(' ')[1], 10);
      const headers = {};
      for (let i = 1; i < lines.length; i++) {
        const idx = lines[i].indexOf(':');
        if (idx === -1) continue;
        headers[lines[i].slice(0, idx).trim().toLowerCase()] = lines[i].slice(idx + 1).trim();
      }
      resolve({ status, headers, body: bodyPart.toString('utf8') });
    });
  });
}

function get(port, target) {
  return rawRequest(port, 'GET', target);
}

function head(port, target) {
  return rawRequest(port, 'HEAD', target);
}

test('root HTML: status/body/content-type charset/no-store/nosniff', async () => {
  fs.writeFileSync(path.join(tmpDir, 'index.html'), '<h1>ink</h1>');
  const port = await start(tmpDir, 0);
  const res = await get(port, '/');
  expect(res.status).toBe(200);
  expect(res.body).toContain('<h1>ink</h1>');
  expect(res.headers['content-type']).toBe('text/html; charset=utf-8');
  expect(res.headers['cache-control']).toBe('no-store');
  expect(res.headers['x-content-type-options']).toBe('nosniff');
});

test('nested JS and JSON: GET and HEAD, HEAD has content-length and empty body', async () => {
  fs.mkdirSync(path.join(tmpDir, 'assets'));
  fs.mkdirSync(path.join(tmpDir, 'data'));
  fs.writeFileSync(path.join(tmpDir, 'assets', 'app.js'), 'console.log(1)');
  fs.writeFileSync(path.join(tmpDir, 'data', 'info.json'), '{"a":1}');
  const port = await start(tmpDir, 0);

  const jsGet = await get(port, '/assets/app.js');
  expect(jsGet.status).toBe(200);
  expect(jsGet.body).toBe('console.log(1)');
  expect(jsGet.headers['content-type']).toBe('application/javascript; charset=utf-8');

  const jsonGet = await get(port, '/data/info.json');
  expect(jsonGet.status).toBe(200);
  expect(jsonGet.body).toBe('{"a":1}');
  expect(jsonGet.headers['content-type']).toBe('application/json; charset=utf-8');

  const jsHead = await head(port, '/assets/app.js');
  expect(jsHead.status).toBe(200);
  expect(jsHead.headers['content-length']).toBe(String(Buffer.byteLength('console.log(1)')));
  expect(jsHead.body).toBe('');

  const jsonHead = await head(port, '/data/info.json');
  expect(jsonHead.status).toBe(200);
  expect(jsonHead.headers['content-length']).toBe(String(Buffer.byteLength('{"a":1}')));
  expect(jsonHead.body).toBe('');
});

test('missing file and directory both 404', async () => {
  fs.mkdirSync(path.join(tmpDir, 'sub'));
  fs.writeFileSync(path.join(tmpDir, 'sub', 'inner.txt'), 'x');
  const port = await start(tmpDir, 0);

  const missing = await get(port, '/nope.js');
  expect(missing.status).toBe(404);

  const dir = await get(port, '/sub');
  expect(dir.status).toBe(404);
});

test('POST is rejected with 405 and Allow: GET, HEAD', async () => {
  fs.writeFileSync(path.join(tmpDir, 'index.html'), '<h1>ink</h1>');
  const port = await start(tmpDir, 0);
  const res = await rawRequest(port, 'POST', '/');
  expect(res.status).toBe(405);
  expect(res.headers.allow).toBe('GET, HEAD');
});

test('traversal attempts never escape root', async () => {
  const parent = fs.mkdtempSync(path.join(os.tmpdir(), 'inkwarrior-outside-'));
  const secretContent = 'TOP-SECRET-OUTSIDE-ROOT';
  fs.writeFileSync(path.join(parent, 'secret.txt'), secretContent);
  const webroot = path.join(parent, 'webroot');
  fs.mkdirSync(webroot);
  fs.writeFileSync(path.join(webroot, 'index.html'), '<h1>ink</h1>');

  try {
    const port = await start(webroot, 0);

    const attempts = [
      '/../secret.txt',
      '/%2e%2e/secret.txt',
      '/..%2fsecret.txt',
      '/..\\secret.txt',
      '/%2e%2e%5csecret.txt',
      '/foo/../../secret.txt',
      '/%2e%2e/%2e%2e/secret.txt',
    ];

    for (const target of attempts) {
      const res = await get(port, target);
      expect([400, 403, 404]).toContain(res.status);
      expect(res.body).not.toContain(secretContent);
    }
  } finally {
    fs.rmSync(parent, { recursive: true, force: true });
  }
});

test('malformed percent encoding returns 400', async () => {
  const port = await start(tmpDir, 0);
  const res1 = await get(port, '/%zz');
  expect(res1.status).toBe(400);
  const res2 = await get(port, '/%');
  expect(res2.status).toBe(400);
});

test('unknown extension serves octet-stream and stop is idempotent', async () => {
  fs.writeFileSync(path.join(tmpDir, 'file.xyz'), 'binary-ish-data');
  const port = await start(tmpDir, 0);
  const res = await get(port, '/file.xyz');
  expect(res.status).toBe(200);
  expect(res.headers['content-type']).toBe('application/octet-stream');
  expect(res.headers['cache-control']).toBeUndefined();

  await stop();
  await expect(stop()).resolves.toBeUndefined();
});
