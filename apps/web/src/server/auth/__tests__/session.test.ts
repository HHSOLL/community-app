jest.mock('jose', () => {
  class SignJWTMock {
    payload: { email: string };
    constructor(payload: { email: string }) {
      this.payload = payload;
    }
    setProtectedHeader() {
      return this;
    }
    setIssuedAt() {
      return this;
    }
    setExpirationTime() {
      return this;
    }
    async sign() {
      return JSON.stringify(this.payload);
    }
  }

  return {
    SignJWT: SignJWTMock,
    jwtVerify: jest.fn(async (token: string) => ({ payload: JSON.parse(token) }))
  };
});

import { TextEncoder } from 'util';
import {
  createSessionToken,
  verifySessionToken,
  setSessionCookie,
  requireSessionEmail
} from '../session';

(global as unknown as { TextEncoder?: typeof TextEncoder }).TextEncoder = TextEncoder;

describe('session helpers', () => {
  it('creates and verifies a session token', async () => {
    const token = await createSessionToken({ email: 'student@berkeley.edu' });
    const session = await verifySessionToken(token);
    expect(session?.email).toBe('student@berkeley.edu');
  });

  it('attaches session cookie and extracts it', async () => {
    const token = await createSessionToken({ email: 'student@berkeley.edu' });
    const headerStore: Record<string, string[]> = {};
    const response = {
      headers: {
        append: (key: string, value: string) => {
          headerStore[key] = headerStore[key] ? [...headerStore[key], value] : [value];
        },
        get: (key: string) => headerStore[key]?.[0] ?? null
      }
    } as unknown as Response;

    setSessionCookie(response, token);
    const cookie = response.headers.get('Set-Cookie');
    expect(cookie).toContain('community_session=');

    const mockRequest = {
      headers: {
        get: (key: string) => (key === 'cookie' ? cookie : null)
      }
    } as unknown as Request;

    const email = await requireSessionEmail(mockRequest);
    expect(email).toBe('student@berkeley.edu');
  });

  it('returns null for missing cookie', async () => {
    const mockRequest = {
      headers: {
        get: () => null
      }
    } as unknown as Request;
    expect(await requireSessionEmail(mockRequest)).toBeNull();
  });
});
