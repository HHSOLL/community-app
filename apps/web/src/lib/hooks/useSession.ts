'use client';

import { useEffect, useState } from 'react';
import { initPosthog, captureClientEvent } from '@/lib/analytics/posthogClient';

type SessionState = {
  email: string | null;
  loading: boolean;
};

export function useSession(): SessionState {
  const [state, setState] = useState<SessionState>({ email: null, loading: true });

  useEffect(() => {
    initPosthog();

    async function resolveSession() {
      try {
        const res = await fetch('/api/session', {
          credentials: 'include'
        });
        const data = await res.json();
        setState({ email: data.email ?? null, loading: false });
        captureClientEvent('session_resolved', { authenticated: Boolean(data.email) });
      } catch (error) {
        console.error('[useSession] failed to resolve session', error);
        setState({ email: null, loading: false });
      }
    }

    void resolveSession();
  }, []);

  return state;
}
