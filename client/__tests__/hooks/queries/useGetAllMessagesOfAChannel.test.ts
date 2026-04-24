import { describe, it, expect, vi } from 'vitest';
import { renderHookWithQuery } from '../../utils/renderWithQuery';
import { useGetAllMessagesOfAChannel } from '@/hooks/queries/useGetAllMessagesOfAChannel';

vi.mock('@/requests/channelRequest', () => ({
  channelRequest: vi.fn(),
  getAllMessagesOfAChannelRequest: vi.fn().mockResolvedValue([]),
}));

describe('useGetAllMessagesOfAChannel', () => {
  it('retourne un objet query', () => {
    const { result } = renderHookWithQuery(() => useGetAllMessagesOfAChannel('1'));
    expect(result.current).toHaveProperty('data');
    expect(result.current).toHaveProperty('isLoading');
  });
});
