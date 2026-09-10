'use strict';
const http = require('http');
const fs   = require('fs');
const path = require('path');

const TEXT_TYPES = new Set(['.html', '.js', '.mjs', '.css', '.json']);

const MIME = {
  '.html':  'text/html',
  '.js':    'application/javascript',
  '.mjs':   'application/javascript',
  '.css':   'text/css',
  '.json':  'application/json',
  '.png':   'image/png',
  '.jpg':   'image/jpeg',
  '.jpeg':  'image/jpeg',
  '.webp':  'image/webp',
  '.gif':   'image/gif',
  '.ico':   'image/x-icon',
  '.svg':   'image/svg+xml',
  '.ogg':   'audio/ogg',
  '.mp3':   'audio/mpeg',
  '.wav':   'audio/wav',
  '.wasm':  'application/wasm',
  '.woff':  'font/woff',
  '.woff2': 'font/woff2',
  '.ttf':   'font/ttf',
  '.otf':   'font/otf',
};

let server = null;

function sendError(res, code, message) {
  res.writeHead(code);
  res.end(message);
}

function start(root, port = 0) {
  if (server) throw new Error('staticServer already running');
  const absRoot = path.resolve(root);
  return new Promise((resolve, reject) => {
    server = http.createServer((req, res) => {
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.writeHead(405, { Allow: 'GET, HEAD' });
        res.end();
        return;
      }

      let pathname;
      try {
        pathname = new URL(req.url, 'http://127.0.0.1').pathname;
      } catch {
        sendError(res, 400, 'Bad request');
        return;
      }

      pathname = pathname.replace(/\\/g, '/');

      if (pathname.indexOf('\0') !== -1) {
        sendError(res, 400, 'Bad request');
        return;
      }
      if (/^\/{2,}/.test(pathname) || /^\/+[a-zA-Z]:/.test(pathname)) {
        sendError(res, 400, 'Bad request');
        return;
      }

      const rawSegments = pathname.split('/');
      let decodedSegments;
      try {
        decodedSegments = rawSegments.map(seg => decodeURIComponent(seg));
      } catch {
        sendError(res, 400, 'Bad request');
        return;
      }
      if (decodedSegments.some(seg => seg === '..' || seg.indexOf('\0') !== -1)) {
        sendError(res, 400, 'Bad request');
        return;
      }

      let rel = decodedSegments.join('/').replace(/^\/+/, '');
      if (rel === '') rel = 'index.html';

      const filePath = path.resolve(absRoot, rel);
      const relToRoot = path.relative(absRoot, filePath);
      if (relToRoot.startsWith('..') || path.isAbsolute(relToRoot)) {
        sendError(res, 403, 'Forbidden');
        return;
      }

      fs.stat(filePath, (statErr, stats) => {
        if (statErr || !stats.isFile()) {
          sendError(res, 404, 'Not found');
          return;
        }
        fs.readFile(filePath, (readErr, data) => {
          if (readErr) {
            sendError(res, 500, 'Internal server error');
            return;
          }
          const ext = path.extname(filePath).toLowerCase();
          const mime = MIME[ext] || 'application/octet-stream';
          const contentType = TEXT_TYPES.has(ext) ? `${mime}; charset=utf-8` : mime;
          const headers = {
            'Content-Type': contentType,
            'Content-Length': data.length,
            'X-Content-Type-Options': 'nosniff',
          };
          if (ext === '.html') headers['Cache-Control'] = 'no-store';
          res.writeHead(200, headers);
          if (req.method === 'HEAD') {
            res.end();
          } else {
            res.end(data);
          }
        });
      });
    });
    server.listen(port, '127.0.0.1', () => resolve(server.address().port));
    server.on('error', err => {
      server = null;
      reject(err);
    });
  });
}

function stop() {
  return new Promise((resolve, reject) => {
    if (!server) return resolve();
    const s = server; server = null;
    s.close(err => (err ? reject(err) : resolve()));
  });
}

module.exports = { start, stop };
