import * as dotenv from 'dotenv';

dotenv.config();

const DEFAULT_CORS_ORIGINS = [
  'http://localhost:3010',
  'http://localhost:5189',
  'https://study.trannhuy.online',
];

export function getCorsOrigins(): string[] {
  const configuredOrigins = process.env.CORS_ORIGINS?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return configuredOrigins?.length ? configuredOrigins : DEFAULT_CORS_ORIGINS;
}

export function isCorsOriginAllowed(origin?: string): boolean {
  if (!origin) {
    return true;
  }

  return getCorsOrigins().includes(origin);
}
