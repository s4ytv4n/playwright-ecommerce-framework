import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const toBool = (value: string | undefined, fallback: boolean): boolean =>
  value === undefined ? fallback : value.trim().toLowerCase() === 'true';

const toInt = (value: string | undefined, fallback: number): number => {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const toUrl = (value: string | undefined, fallback: string, name: string): string => {
  const url = value?.trim() || fallback;
  try {
    return new URL(url).toString().replace(/\/$/, '');
  } catch {
    throw new Error(`${name} must be a valid absolute URL, got: "${url}"`);
  }
};

const isCI = Boolean(process.env.CI);

/**
 * Single source of truth for runtime settings.
 * Everything has a safe default, so the suite runs without a .env file.
 */
export const env = {
  baseUrl: toUrl(process.env.BASE_URL, 'https://automationexercise.com', 'BASE_URL'),
  apiUrl: toUrl(process.env.API_URL, 'https://automationexercise.com/api', 'API_URL'),
  isCI,
  headless: toBool(process.env.HEADLESS, true),
  workers: toInt(process.env.WORKERS, isCI ? 2 : 4),
  retries: toInt(process.env.RETRIES, isCI ? 2 : 0),
} as const;
