export type EventPayload = Record<string, unknown>;

export function logEvent(eventName: string, payload: EventPayload) {
  if (process.env.NODE_ENV !== 'production') {
    console.info(`[event:${eventName}]`, payload);
  }
  // TODO: integrate with PostHog or Supabase analytics capture
}
