'use strict';

/**
 * Read-only static route for the family magazine.
 * GET and HEAD only. It does not write programs, assessments, reports,
 * markbooks, or any other school record.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

const ROUTES = Object.freeze({
  '/parents-hub': { file: 'index.html', type: 'text/html; charset=utf-8' },
  '/parents-hub/': { file: 'index.html', type: 'text/html; charset=utf-8' },
  '/parents-hub/index.html': { file: 'index.html', type: 'text/html; charset=utf-8' },
  '/parents-hub/magazine.css': { file: 'magazine.css', type: 'text/css; charset=utf-8' },
  '/parents-hub/publisher.js': { file: 'publisher.js', type: 'text/javascript; charset=utf-8' },
  // The page at /parents-hub (no trailing slash) resolves these as siblings of the hub.
  '/magazine.css': { file: 'magazine.css', type: 'text/css; charset=utf-8' },
  '/publisher.js': { file: 'publisher.js', type: 'text/javascript; charset=utf-8' },
});

function pathnameOf(url) {
  try {
    return decodeURIComponent(String(url || '/').split('?')[0]);
  } catch (err) {
    return null;
  }
}

function resolveParentsHub(url) {
  const pathname = pathnameOf(url);
  if (!pathname || !Object.prototype.hasOwnProperty.call(ROUTES, pathname)) return null;
  return ROUTES[pathname];
}

function createServer() {
  return http.createServer((req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { Allow: 'GET, HEAD', 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Method not allowed');
      return;
    }

    const asset = resolveParentsHub(req.url);
    if (!asset) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }

    const filePath = path.resolve(ROOT, asset.file);
    const rootPath = path.resolve(ROOT);
    if (filePath !== rootPath && !filePath.startsWith(rootPath + path.sep)) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }

    fs.readFile(filePath, (err, body) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not found');
        return;
      }
      res.writeHead(200, {
        'Content-Type': asset.type,
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      });
      if (req.method === 'HEAD') res.end();
      else res.end(body);
    });
  });
}

function listen(port, host) {
  const server = createServer();
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, () => resolve(server));
  });
}

module.exports = {
  ROUTES,
  resolveParentsHub,
  createServer,
  listen,
};

if (require.main === module) {
  const port = Number(process.env.PORT) || 8787;
  const host = process.env.HOST || '0.0.0.0';
  listen(port, host).then(() => {
    console.log('Parents hub http://127.0.0.1:' + port + '/parents-hub');
  });
}
