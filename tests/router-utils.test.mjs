import test from 'node:test';
import assert from 'node:assert/strict';
import { parseHash } from '../js/router-utils.mjs';

test('parseHash resolves home route for empty and root hashes', () => {
  assert.deepEqual(parseHash(''), { name: 'home', params: {} });
  assert.deepEqual(parseHash('#/'), { name: 'home', params: {} });
});

test('parseHash resolves katha route with day parameter', () => {
  assert.deepEqual(parseHash('#/katha/3'), { name: 'katha', params: { day: '3' } });
});

test('parseHash defaults day to 0 when absent', () => {
  assert.deepEqual(parseHash('#/katha'), { name: 'katha', params: { day: '0' } });
});

test('parseHash falls back to home for unknown route', () => {
  assert.deepEqual(parseHash('#/unknown/path'), { name: 'home', params: {} });
});
