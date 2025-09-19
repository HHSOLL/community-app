import { z } from 'zod';

const envSchema = z.object({
  EMAIL_DOMAIN_WHITELIST: z.string().default('berkeley.edu'),
  MAGIC_LINK_SECRET: z.string().default('dev-secret-key'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEXT_PUBLIC_DEFAULT_LOCALE: z.string().default('ko'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  POSTHOG_API_KEY: z.string().optional(),
  POSTHOG_HOST: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().optional()
});

const parsed = envSchema.safeParse({
  EMAIL_DOMAIN_WHITELIST: process.env.EMAIL_DOMAIN_WHITELIST,
  MAGIC_LINK_SECRET: process.env.MAGIC_LINK_SECRET,
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_DEFAULT_LOCALE: process.env.NEXT_PUBLIC_DEFAULT_LOCALE,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  POSTHOG_API_KEY: process.env.POSTHOG_API_KEY,
  POSTHOG_HOST: process.env.POSTHOG_HOST,
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST
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
  return values.MAGIC_LINK_SECRET;
}

export function getAppBaseUrl() {
  return values.NEXT_PUBLIC_APP_URL;
}

export function getSupabaseConfig() {
  if (values.SUPABASE_URL && values.SUPABASE_SERVICE_ROLE_KEY) {
    return {
      url: values.SUPABASE_URL,
      serviceRoleKey: values.SUPABASE_SERVICE_ROLE_KEY
    } as const;
  }

  return null;
}

export function getResendApiKey() {
  return values.RESEND_API_KEY ?? '';
}

export function getPosthogConfig() {
  if (!values.POSTHOG_API_KEY) {
    return null;
  }

  return {
    apiKey: values.POSTHOG_API_KEY,
    host: values.POSTHOG_HOST || 'https://us.posthog.com'
  } as const;
}

export function getPublicPosthogConfig() {
  if (!values.NEXT_PUBLIC_POSTHOG_KEY) {
    return null;
  }

  return {
    apiKey: values.NEXT_PUBLIC_POSTHOG_KEY,
    host: values.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.posthog.com'
  } as const;
}
