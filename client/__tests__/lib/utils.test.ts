import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn', () => {
  it('retourne une classe simple', () => {
    expect(cn('foo')).toBe('foo')
  })

  it('fusionne plusieurs classes', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('ignore les valeurs falsy', () => {
    expect(cn('foo', undefined, null, false, 'bar')).toBe('foo bar')
  })

  it('résout les conflits Tailwind (la dernière gagne)', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })

  it('gère les classes conditionnelles avec objet', () => {
    expect(cn({ 'text-red-500': true, 'text-blue-500': false })).toBe('text-red-500')
  })

  it('retourne une chaîne vide si aucun argument', () => {
    expect(cn()).toBe('')
  })
})
