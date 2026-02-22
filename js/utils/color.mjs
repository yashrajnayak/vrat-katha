export function withHexAlpha(color, alphaHex) {
  if (typeof color !== 'string' || typeof alphaHex !== 'string') return color;

  const normalizedColor = color.trim();
  const normalizedAlpha = alphaHex.trim().toUpperCase();

  if (!/^#[0-9A-Fa-f]{6}$/.test(normalizedColor)) return normalizedColor;
  if (!/^[0-9A-F]{2}$/.test(normalizedAlpha)) return normalizedColor;

  return `${normalizedColor}${normalizedAlpha}`;
}
