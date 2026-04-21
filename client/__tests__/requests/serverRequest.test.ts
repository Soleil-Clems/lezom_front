import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  serverRequest,
  getAllServersRequest,
  getAllChannelsOfAServerRequest,
  updateServerNameRequest,
  deleteServerRequest,
  updateChannelNameRequest,
  deleteChannelRequest,
  getServerMembersRequest,
} from '@/requests/serverRequest';

vi.mock('@/lib/customFetch', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

import customfetch from '@/lib/customFetch';

describe('serverRequest', () => {
  beforeEach(() => vi.clearAllMocks());

  it('serverRequest appelle POST servers', async () => {
    vi.mocked(customfetch.post).mockResolvedValue({ id: 1 });
    await serverRequest({ name: 'Mon Serveur' });
    expect(customfetch.post).toHaveBeenCalledWith('servers', { name: 'Mon Serveur' });
  });

  it('getAllServersRequest appelle GET servers', async () => {
    vi.mocked(customfetch.get).mockResolvedValue([]);
    await getAllServersRequest();
    expect(customfetch.get).toHaveBeenCalledWith('servers');
  });

  it('getAllChannelsOfAServerRequest appelle GET channels/server/:id', async () => {
    vi.mocked(customfetch.get).mockResolvedValue([]);
    await getAllChannelsOfAServerRequest(1);
    expect(customfetch.get).toHaveBeenCalledWith('channels/server/1');
  });

  it('updateServerNameRequest appelle PATCH servers/:id', async () => {
    vi.mocked(customfetch.patch).mockResolvedValue({});
    await updateServerNameRequest(1, 'Nouveau Nom');
    expect(customfetch.patch).toHaveBeenCalledWith('servers/1', { name: 'Nouveau Nom' });
  });

  it('deleteServerRequest appelle DELETE servers/:id', async () => {
    vi.mocked(customfetch.delete).mockResolvedValue({});
    await deleteServerRequest(1);
    expect(customfetch.delete).toHaveBeenCalledWith('servers/1');
  });

  it('updateChannelNameRequest appelle PATCH channels/:id', async () => {
    vi.mocked(customfetch.patch).mockResolvedValue({});
    await updateChannelNameRequest(2, 'nouveau-nom');
    expect(customfetch.patch).toHaveBeenCalledWith('channels/2', { name: 'nouveau-nom' });
  });

  it('deleteChannelRequest appelle DELETE channels/:id', async () => {
    vi.mocked(customfetch.delete).mockResolvedValue({});
    await deleteChannelRequest(2);
    expect(customfetch.delete).toHaveBeenCalledWith('channels/2');
  });

  it('getServerMembersRequest appelle GET servers/:id/members', async () => {
    vi.mocked(customfetch.get).mockResolvedValue({ data: [], meta: {} });
    await getServerMembersRequest(1);
    expect(customfetch.get).toHaveBeenCalledWith('servers/1/members');
  });

  it('getServerMembersRequest inclut les query params si fournis', async () => {
    vi.mocked(customfetch.get).mockResolvedValue({ data: [], meta: {} });
    await getServerMembersRequest(1, { page: 2, limit: 20, search: 'alex' });
    expect(customfetch.get).toHaveBeenCalledWith('servers/1/members?page=2&limit=20&search=alex');
  });
});
