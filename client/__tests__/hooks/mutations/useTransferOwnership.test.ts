import { describe, it, expect, vi } from 'vitest'
import { renderHookWithQuery } from '../../utils/renderWithQuery'
import { useTransferOwnership } from '@/hooks/mutations/useTransferOwnership'

vi.mock('@/requests/transferOwnershipRequest', () => ({
  transferOwnershipRequest: vi.fn(),
}))
vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }))

describe('useTransferOwnership', () => {
  it('expose mutate et status idle', () => {
    const { result } = renderHookWithQuery(() => useTransferOwnership())
    expect(result.current).toHaveProperty('mutate')
    expect(result.current.status).toBe('idle')
  })
})
