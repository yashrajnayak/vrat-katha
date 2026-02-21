const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3456;
const DIR = __dirname;
const INDEX_PATH = path.join(DIR, 'index.html');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

function sendError(res, statusCode, message) {
  res.writeHead(statusCode, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(message);
}

function sendFile(res, filePath, method) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  try {
    const body = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    if (method === 'HEAD') {
      res.end();
      return;
    }
    res.end(body);
  } catch {
    sendError(res, 500, 'Internal Server Error');
  }
}

function getSafeFilePath(urlPath) {
  const normalizedPath = path.posix.normalize(urlPath || '/');
  const relativePath = normalizedPath.startsWith('/') ? `.${normalizedPath}` : `./${normalizedPath}`;
  return path.resolve(DIR, relativePath);
}

function isWithinBaseDir(filePath) {
  return filePath === DIR || filePath.startsWith(`${DIR}${path.sep}`);
}

const server = http.createServer((req, res) => {
  const method = req.method || 'GET';
  if (method !== 'GET' && method !== 'HEAD') {
    sendError(res, 405, 'Method Not Allowed');
    return;
  }

  if (!req.url) {
    sendError(res, 400, 'Bad Request');
    return;
  }

  let pathname;
  try {
    const rawPath = req.url.split('?')[0] || '/';
    pathname = decodeURIComponent(rawPath);
    if (!pathname.startsWith('/')) {
      pathname = `/${pathname}`;
    }
  } catch {
    sendError(res, 400, 'Bad Request');
    return;
  }

  if (pathname.split('/').includes('..')) {
    sendError(res, 403, 'Forbidden');
    return;
  }

  if (pathname === '/') {
    sendFile(res, INDEX_PATH, method);
    return;
  }

  const filePath = getSafeFilePath(pathname);
  if (!isWithinBaseDir(filePath)) {
    sendError(res, 403, 'Forbidden');
    return;
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    sendFile(res, filePath, method);
    return;
  }

  if (path.extname(pathname) === '') {
    sendFile(res, INDEX_PATH, method);
    return;
  }

  sendError(res, 404, 'Not Found');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Vanilla Vrat Katha app running at http://localhost:${PORT}`);
});
