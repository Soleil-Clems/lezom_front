import { describe, it, expect } from 'vitest'
import { createChannelSchema } from '@/schemas/create-channel.dto'

describe('createChannelSchema', () => {
  it('valide un channel text correct', () => {
    const result = createChannelSchema.parse({ name: 'general', type: 'text', serverId: 1 })
    expect(result.name).toBe('general')
    expect(result.type).toBe('text')
  })

  it('valide un channel call', () => {
    const result = createChannelSchema.parse({ name: 'vocal', type: 'call', serverId: 1 })
    expect(result.type).toBe('call')
  })

  it('rejette un nom vide', () => {
    expect(() => createChannelSchema.parse({ name: '', type: 'text', serverId: 1 })).toThrow()
  })

  it('rejette un type invalide', () => {
    expect(() => createChannelSchema.parse({ name: 'test', type: 'video', serverId: 1 })).toThrow()
  })
})
