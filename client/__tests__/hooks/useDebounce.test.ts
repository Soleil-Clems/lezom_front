import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from '@/hooks/useDebounce'

describe('useDebounce', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('retourne la valeur initiale immédiatement', () => {
    const { result } = renderHook(() => useDebounce('initial', 300))
    expect(result.current).toBe('initial')
  })

  it('ne met pas à jour la valeur avant le délai', () => {
    const { result, rerender } = renderHook(({ val }) => useDebounce(val, 300), {
      initialProps: { val: 'initial' },
    })
    rerender({ val: 'updated' })
    expect(result.current).toBe('initial')
  })

  it('met à jour la valeur après le délai', () => {
    const { result, rerender } = renderHook(({ val }) => useDebounce(val, 300), {
      initialProps: { val: 'initial' },
    })
    rerender({ val: 'updated' })
    act(() => vi.advanceTimersByTime(300))
    expect(result.current).toBe('updated')
  })

  it('utilise un délai par défaut de 300ms', () => {
    const { result, rerender } = renderHook(({ val }) => useDebounce(val), {
      initialProps: { val: 'a' },
    })
    rerender({ val: 'b' })
    act(() => vi.advanceTimersByTime(299))
    expect(result.current).toBe('a')
    act(() => vi.advanceTimersByTime(1))
    expect(result.current).toBe('b')
  })

  it('annule le timer précédent si la valeur change à nouveau', () => {
    const { result, rerender } = renderHook(({ val }) => useDebounce(val, 300), {
      initialProps: { val: 'a' },
    })
    rerender({ val: 'b' })
    act(() => vi.advanceTimersByTime(200))
    rerender({ val: 'c' })
    act(() => vi.advanceTimersByTime(200))
    expect(result.current).toBe('a')
    act(() => vi.advanceTimersByTime(100))
    expect(result.current).toBe('c')
  })

  it('fonctionne avec des valeurs numériques', () => {
    const { result, rerender } = renderHook(({ val }) => useDebounce(val, 100), {
      initialProps: { val: 0 },
    })
    rerender({ val: 42 })
    act(() => vi.advanceTimersByTime(100))
    expect(result.current).toBe(42)
  })
})
