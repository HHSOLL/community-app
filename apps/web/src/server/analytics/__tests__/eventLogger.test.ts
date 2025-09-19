import { logEvent } from '../eventLogger';

jest.mock('../posthogServer', () => ({
  captureServerEvent: jest.fn(() => Promise.resolve())
}));

describe('eventLogger', () => {
  it('logs events without throwing', async () => {
    await expect(logEvent('test_event', { foo: 'bar' })).resolves.not.toThrow();
  });
});
