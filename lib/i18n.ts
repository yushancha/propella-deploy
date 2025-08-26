import en from '../locales/en.json';

type LocaleResources = typeof en;

// In the future, we can add runtime locale switching. For now, default to English.
let currentLocale: LocaleResources = en;

export function setLocale(resources: LocaleResources) {
  currentLocale = resources;
}

function getByPath(object: any, path: string): string | undefined {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), object);
}

export function t(key: string, fallback?: string): string {
  const value = getByPath(currentLocale, key);
  if (typeof value === 'string') return value;
  return fallback ?? key;
}

export function tn(key: string, count: number, fallback?: string): string {
  // Simple pluralization placeholder; expand as needed
  const value = getByPath(currentLocale, key);
  if (typeof value === 'string') return value;
  return fallback ?? key;
}

