import { captureServerEvent } from '@/server/analytics/posthogServer';

export type EventPayload = Record<string, unknown>;

export async function logEvent(eventName: string, payload: EventPayload) {
  if (process.env.NODE_ENV !== 'production') {
    console.info(`[event:${eventName}]`, payload);
  }

  await captureServerEvent(eventName, payload);
}
