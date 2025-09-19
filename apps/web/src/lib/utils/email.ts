import { z } from 'zod';

const emailSchema = z.string().email();

export function normalizeEmail(input: string) {
  return emailSchema.parse(input.trim().toLowerCase());
}

export function extractDomain(email: string) {
  return email.split('@')[1] ?? '';
}

export function isAllowedSchoolEmail(email: string, allowedDomains: string[]): boolean {
  const normalized = normalizeEmail(email);
  const domain = extractDomain(normalized);
  return allowedDomains.includes(domain);
}
