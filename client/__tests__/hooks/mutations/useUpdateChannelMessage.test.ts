import { describe, it, expect, vi } from 'vitest';
import { renderHookWithQuery } from '../../utils/renderWithQuery';
import { useUpdateChannelMessage } from '@/hooks/mutations/useUpdateChannelMessage';

vi.mock('@/requests/messageRequest', () => ({
  updateChannelMessageRequest: vi.fn(),
  deleteChannelMessageRequest: vi.fn(),
  sendMessageRequest: vi.fn(),
}));
vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

describe('useUpdateChannelMessage', () => {
  it('expose mutate et status idle', () => {
    const { result } = renderHookWithQuery(() => useUpdateChannelMessage('1'));
    expect(result.current).toHaveProperty('mutate');
    expect(result.current.status).toBe('idle');
  });
});
