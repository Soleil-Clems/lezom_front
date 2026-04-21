import { describe, it, expect } from 'vitest'
import { createServerSchema } from '@/schemas/create-server.dto'
import { serversSchema } from '@/schemas/server.dto'

describe('createServerSchema', () => {
  it('valide un nom de serveur correct', () => {
    const result = createServerSchema.parse({ name: 'Mon Serveur' })
    expect(result.name).toBe('Mon Serveur')
  })

  it('rejette un nom vide', () => {
    expect(() => createServerSchema.parse({ name: '' })).toThrow()
  })
})

describe('serversSchema', () => {
  it('valide un serveur correct', () => {
    const result = serversSchema.parse({ id: 1, name: 'Serveur' })
    expect(result.id).toBe(1)
    expect(result.name).toBe('Serveur')
  })

  it('accepte une image optionnelle', () => {
    const result = serversSchema.parse({ id: 1, name: 'Serveur', image: 'https://example.com/img.png' })
    expect(result.image).toBe('https://example.com/img.png')
  })

  it('rejette un id manquant', () => {
    expect(() => serversSchema.parse({ name: 'Serveur' })).toThrow()
  })
})
