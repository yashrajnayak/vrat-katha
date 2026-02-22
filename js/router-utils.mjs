export function parseHash(hashValue) {
  const hash = typeof hashValue === 'string' && hashValue.trim() !== '' ? hashValue : '#/';
  const [path, ...params] = hash.slice(1).split('/').filter(Boolean);

  if (!path) {
    return { name: 'home', params: {} };
  }

  if (path === 'katha') {
    return { name: 'katha', params: { day: params[0] || '0' } };
  }

  return { name: 'home', params: {} };
}
