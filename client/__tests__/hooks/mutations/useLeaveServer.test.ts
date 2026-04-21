import { describe, it, expect, vi } from 'vitest'
import { renderHookWithQuery } from '../../utils/renderWithQuery'
import { useLeaveServer } from '@/hooks/mutations/useLeaveServer'

vi.mock('@/requests/leaveServerRequest', () => ({
  leaveServerRequest: vi.fn(),
}))
vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }))
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }))

describe('useLeaveServer', () => {
  it('expose mutate et status idle', () => {
    const { result } = renderHookWithQuery(() => useLeaveServer())
    expect(result.current).toHaveProperty('mutate')
    expect(result.current.status).toBe('idle')
  })
})
