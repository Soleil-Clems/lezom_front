import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  sendMessageRequest,
  updateChannelMessageRequest,
  deleteChannelMessageRequest,
} from '@/requests/messageRequest';

vi.mock('@/lib/customFetch', () => ({
  customfetch: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

import { customfetch } from '@/lib/customFetch';

describe('messageRequest', () => {
  beforeEach(() => vi.clearAllMocks());

  it('sendMessageRequest appelle POST messages', async () => {
    vi.mocked(customfetch.post).mockResolvedValue({ id: 1 });
    await sendMessageRequest({ content: 'hello', type: 'text', channelId: 1 });
    expect(customfetch.post).toHaveBeenCalledWith(
      'messages',
      expect.objectContaining({ content: 'hello' }),
    );
  });

  it('updateChannelMessageRequest appelle PATCH messages/:id', async () => {
    vi.mocked(customfetch.patch).mockResolvedValue({});
    await updateChannelMessageRequest(5, { content: 'updated' });
    expect(customfetch.patch).toHaveBeenCalledWith('messages/5', { content: 'updated' });
  });

  it('deleteChannelMessageRequest appelle DELETE messages/:id', async () => {
    vi.mocked(customfetch.delete).mockResolvedValue({});
    await deleteChannelMessageRequest(5);
    expect(customfetch.delete).toHaveBeenCalledWith('messages/5');
  });
});
