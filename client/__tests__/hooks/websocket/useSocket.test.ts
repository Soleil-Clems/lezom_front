import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'

const mockSocket = {
  connected: true,
  on: vi.fn(),
  off: vi.fn(),
  once: vi.fn(),
  emit: vi.fn(),
}

vi.mock('@/lib/socket', () => ({
  socketManager: {
    connect: vi.fn(() => mockSocket),
    getSocket: vi.fn(() => mockSocket),
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    reconnectWithNewToken: vi.fn(),
  },
}))

vi.mock('@/store/authStore', () => ({
  default: vi.fn((selector: any) => selector({ token: 'test-token' })),
}))

import { useSocket } from '@/hooks/websocket/useSocket'

describe('useSocket', () => {
  beforeEach(() => vi.clearAllMocks())

  it('retourne isConnected, socket, emit, on, off', () => {
    const { result } = renderHook(() => useSocket())
    expect(result.current).toHaveProperty('isConnected')
    expect(result.current).toHaveProperty('socket')
    expect(result.current).toHaveProperty('emit')
    expect(result.current).toHaveProperty('on')
    expect(result.current).toHaveProperty('off')
  })

  it('isConnected est true si socket.connected est true', () => {
    const { result } = renderHook(() => useSocket())
    expect(result.current.isConnected).toBe(true)
  })
})
