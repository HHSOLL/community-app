import { PostHog } from 'posthog-node';
import { getPosthogConfig } from '@/lib/env';

let cachedClient: PostHog | null | undefined;

export function getPosthogServerClient() {
  if (cachedClient !== undefined) {
    return cachedClient;
  }

  const config = getPosthogConfig();
  if (!config) {
    cachedClient = null;
    return cachedClient;
  }

  cachedClient = new PostHog(config.apiKey, {
    host: config.host,
    flushAt: 1,
    flushInterval: 0
  });
  return cachedClient;
}

export async function captureServerEvent(event: string, payload: Record<string, unknown>) {
  const client = getPosthogServerClient();
  if (!client) {
    return;
  }

  await client.capture({
    distinctId: (payload.email as string) ?? 'anonymous',
    event,
    properties: payload
  });
}
