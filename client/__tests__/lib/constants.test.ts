import { describe, it, expect } from 'vitest'
import { gifApiKey, gifClientKey } from '@/lib/constants'

describe('constants', () => {
  it('gifApiKey est une chaîne', () => {
    expect(typeof gifApiKey).toBe('string')
  })

  it('gifClientKey est une chaîne', () => {
    expect(typeof gifClientKey).toBe('string')
  })
})
