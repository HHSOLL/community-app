import { extractDomain, isAllowedSchoolEmail, normalizeEmail } from '../email';

describe('email utilities', () => {
  it('normalizes email casing and whitespace', () => {
    expect(normalizeEmail('  Test@Berkeley.edu ')).toBe('test@berkeley.edu');
  });

  it('extracts domain correctly', () => {
    expect(extractDomain('user@berkeley.edu')).toBe('berkeley.edu');
  });

  it('allows whitelisted domains', () => {
    expect(isAllowedSchoolEmail('student@berkeley.edu', ['berkeley.edu'])).toBe(true);
  });

  it('rejects non-whitelisted domains', () => {
    expect(isAllowedSchoolEmail('user@gmail.com', ['berkeley.edu'])).toBe(false);
  });
});
