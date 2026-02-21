let kathasCache = null;

export async function loadKathas() {
  if (kathasCache) return kathasCache;
  try {
    const response = await fetch('data/kathas.json');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('Invalid kathas payload');
    }

    kathasCache = data;
    return kathasCache;
  } catch (e) {
    console.error('Failed to load kathas:', e);
    return [];
  }
}

export function getTodayDayIndex() {
  const jsDay = new Date().getDay();
  return jsDay;
}

export function getKathaForDay(kathas, dayIndex) {
  if (!Array.isArray(kathas) || kathas.length === 0) return null;
  return kathas.find((k) => k.dayIndex === dayIndex) || kathas[0];
}
