import { z } from 'zod';

const envSchema = z.object({
  EMAIL_DOMAIN_WHITELIST: z.string().default('berkeley.edu'),
  MAGIC_LINK_SECRET: z.string().optional(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEXT_PUBLIC_DEFAULT_LOCALE: z.string().default('ko')
});

const parsed = envSchema.safeParse({
  EMAIL_DOMAIN_WHITELIST: process.env.EMAIL_DOMAIN_WHITELIST,
  MAGIC_LINK_SECRET: process.env.MAGIC_LINK_SECRET,
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_DEFAULT_LOCALE: process.env.NEXT_PUBLIC_DEFAULT_LOCALE
});

if (!parsed.success) {
  console.error('Invalid environment variables', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment configuration');
}

const values = parsed.data;

export function getAllowedDomains(): string[] {
  return values.EMAIL_DOMAIN_WHITELIST.split(',').map((domain) => domain.trim().toLowerCase());
}

export function getNodeEnv() {
  return values.NODE_ENV;
}

export function getDefaultLocale() {
  return values.NEXT_PUBLIC_DEFAULT_LOCALE;
}

export function getMagicLinkSecret() {
  return values.MAGIC_LINK_SECRET ?? '';
}
