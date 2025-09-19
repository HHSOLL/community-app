import { SignJWT, jwtVerify } from 'jose';
import { getMagicLinkSecret } from '@/lib/env';

const SESSION_COOKIE = 'community_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

export type SessionPayload = {
  email: string;
};

function getSecretKey() {
  return new TextEncoder().encode(getMagicLinkSecret());
}

export async function createSessionToken(payload: SessionPayload) {
  const secret = getSecretKey();
  const issuedAt = Math.floor(Date.now() / 1000);

  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(issuedAt)
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(secret);
}

export async function verifySessionToken(token: string) {
  try {
    const secret = getSecretKey();
    const { payload } = await jwtVerify<{ email: string }>(token, secret, {
      algorithms: ['HS256']
    });

    if (!payload.email) {
      return null;
    }

    return { email: payload.email } satisfies SessionPayload;
  } catch (error) {
    return null;
  }
}

export function setSessionCookie(response: Response, token: string) {
  response.headers.append(
    'Set-Cookie',
    `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}`
  );
}

export function clearSessionCookie(response: Response) {
  response.headers.append('Set-Cookie', `${SESSION_COOKIE}=; Path=/; Max-Age=0`);
}

export function extractSessionToken(request: Request) {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';').map((part) => part.trim());
  const session = cookies.find((cookie) => cookie.startsWith(`${SESSION_COOKIE}=`));
  if (!session) return null;

  return session.split('=')[1] ?? null;
}

export async function requireSessionEmail(request: Request) {
  const token = extractSessionToken(request);
  if (!token) {
    return null;
  }

  const session = await verifySessionToken(token);
  return session?.email ?? null;
}
