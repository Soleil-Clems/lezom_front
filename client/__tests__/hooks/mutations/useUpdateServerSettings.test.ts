import { describe, it, expect, vi } from 'vitest'
import { renderHookWithQuery } from '../../utils/renderWithQuery'
import { useUpdateServer, useDeleteServer, useUpdateChannel, useDeleteChannel, useUpdateMemberRole } from '@/hooks/mutations/updateServerSettings'

vi.mock('@/requests/serverRequest', () => ({
  updateServerNameRequest: vi.fn(),
  deleteServerRequest: vi.fn(),
  updateChannelNameRequest: vi.fn(),
  deleteChannelRequest: vi.fn(),
  updateMemberRoleRequest: vi.fn(),
  serverRequest: vi.fn(),
  getAllServersRequest: vi.fn(),
}))

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }))

describe('updateServerSettings mutations', () => {
  it('useUpdateServer expose mutate', () => {
    const { result } = renderHookWithQuery(() => useUpdateServer())
    expect(result.current).toHaveProperty('mutate')
  })

  it('useDeleteServer expose mutate', () => {
    const { result } = renderHookWithQuery(() => useDeleteServer())
    expect(result.current).toHaveProperty('mutate')
  })

  it('useUpdateChannel expose mutate', () => {
    const { result } = renderHookWithQuery(() => useUpdateChannel())
    expect(result.current).toHaveProperty('mutate')
  })

  it('useDeleteChannel expose mutate', () => {
    const { result } = renderHookWithQuery(() => useDeleteChannel())
    expect(result.current).toHaveProperty('mutate')
  })

  it('useUpdateMemberRole expose mutate', () => {
    const { result } = renderHookWithQuery(() => useUpdateMemberRole())
    expect(result.current).toHaveProperty('mutate')
  })
})
