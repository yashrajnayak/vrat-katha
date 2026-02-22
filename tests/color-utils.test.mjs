import test from 'node:test';
import assert from 'node:assert/strict';
import { withHexAlpha } from '../js/utils/color.mjs';

test('withHexAlpha appends alpha to 6-digit hex color', () => {
  assert.equal(withHexAlpha('#E65100', 'BB'), '#E65100BB');
});

test('withHexAlpha returns original value for unsupported color formats', () => {
  assert.equal(withHexAlpha('rgba(0,0,0,0.5)', 'CC'), 'rgba(0,0,0,0.5)');
});

test('withHexAlpha returns original value when alpha is invalid', () => {
  assert.equal(withHexAlpha('#E65100', 'XYZ'), '#E65100');
});
