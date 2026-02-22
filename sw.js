const CACHE_NAME = 'vrat-katha-v4';
const CORE_URLS = [
  './',
  'index.html',
  'manifest.json',
  'data/kathas.json',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'css/styles.css',
  'js/app.js',
];

const HTML_ASSET_PATTERN = /<(?:link|script)[^>]+(?:href|src)=["']([^"']+)["']/gi;
const MODULE_IMPORT_PATTERN = /(?:import\s+(?:[^"']*?from\s+)?|import\()\s*["']([^"']+)["']/g;

function normalizePath(urlPath) {
  if (!urlPath) return '';
  if (urlPath === './') return './';

  const cleanPath = urlPath.split('#')[0].split('?')[0];
  if (!cleanPath || cleanPath === '/') return './';

  return cleanPath
    .replace(/^\//, '')
    .replace(/^\.\//, '');
}

function isLocalPath(value) {
  return value
    && !/^(https?:)?\/\//i.test(value)
    && !value.startsWith('data:')
    && !value.startsWith('blob:');
}

function resolveLocalPath(specifier, fromPath) {
  if (!isLocalPath(specifier)) return '';

  if (specifier.startsWith('/')) {
    return normalizePath(specifier);
  }

  const basePath = fromPath === './' ? 'index.html' : fromPath;
  const baseUrl = new URL(basePath, `${self.location.origin}/`);
  const resolved = new URL(specifier, baseUrl);

  if (resolved.origin !== self.location.origin) return '';
  return normalizePath(resolved.pathname);
}

async function safeFetchText(url) {
  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) return '';
    return response.text();
  } catch {
    return '';
  }
}

function extractHtmlAssets(html) {
  const urls = new Set();
  let match;

  while ((match = HTML_ASSET_PATTERN.exec(html)) !== null) {
    const resolved = resolveLocalPath(match[1], 'index.html');
    if (resolved) urls.add(resolved);
  }

  HTML_ASSET_PATTERN.lastIndex = 0;
  return urls;
}

function extractModuleImports(source, fromPath) {
  const urls = new Set();
  let match;

  while ((match = MODULE_IMPORT_PATTERN.exec(source)) !== null) {
    const resolved = resolveLocalPath(match[1], fromPath);
    if (resolved && /\.(?:js|mjs)$/.test(resolved)) urls.add(resolved);
  }

  MODULE_IMPORT_PATTERN.lastIndex = 0;
  return urls;
}

async function collectModuleGraph(entryModule) {
  const discovered = new Set();
  const queue = [normalizePath(entryModule)];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || discovered.has(current)) continue;

    discovered.add(current);
    const source = await safeFetchText(current);
    if (!source) continue;

    const imports = extractModuleImports(source, current);
    imports.forEach((url) => {
      if (!discovered.has(url)) queue.push(url);
    });
  }

  return discovered;
}

async function buildPrecacheUrls() {
  const urls = new Set(CORE_URLS.map((url) => normalizePath(url)));

  const indexHtml = await safeFetchText('index.html');
  if (indexHtml) {
    extractHtmlAssets(indexHtml).forEach((url) => urls.add(url));
  }

  const moduleUrls = await collectModuleGraph('js/app.js');
  moduleUrls.forEach((url) => urls.add(url));

  return Array.from(urls);
}

async function precacheShell() {
  const cache = await caches.open(CACHE_NAME);
  const urls = await buildPrecacheUrls();

  await Promise.all(urls.map(async (url) => {
    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (response.ok) {
        await cache.put(url, response.clone());
      }
    } catch {
      // Best effort cache warmup.
    }
  }));
}

self.addEventListener('install', (event) => {
  event.waitUntil(precacheShell().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => Promise.all(
      names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)),
    )).then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  event.respondWith((async () => {
    try {
      const networkResponse = await fetch(event.request);
      if (networkResponse.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) return cachedResponse;

      if (event.request.mode === 'navigate') {
        const fallback = await caches.match('index.html') || await caches.match('./');
        if (fallback) return fallback;
      }

      throw error;
    }
  })());
});
