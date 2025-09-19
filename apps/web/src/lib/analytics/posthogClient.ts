'use client';

import posthog from 'posthog-js';

let initialized = false;

export function initPosthog() {
  if (initialized) return;
  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!apiKey) return;
  posthog.init(apiKey, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.posthog.com',
    capture_pageview: true,
    autocapture: true
  });
  initialized = true;
}

export function captureClientEvent(event: string, properties: Record<string, unknown> = {}) {
  if (!initialized) {
    initPosthog();
  }
  if (initialized) {
    posthog.capture(event, properties);
  }
}
