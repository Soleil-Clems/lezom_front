import { describe, it, expect, vi } from 'vitest';
import { renderHookWithQuery } from '../../utils/renderWithQuery';
import { useCreateChannel } from '@/hooks/mutations/useCreateChannel';

vi.mock('@/requests/channelRequest', () => ({
  channelRequest: vi.fn(),
  getAllMessagesOfAChannelRequest: vi.fn(),
}));

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

describe('useCreateChannel', () => {
  it('expose mutate et status idle', () => {
    const { result } = renderHookWithQuery(() => useCreateChannel());
    expect(result.current).toHaveProperty('mutate');
    expect(result.current.status).toBe('idle');
  });
});
