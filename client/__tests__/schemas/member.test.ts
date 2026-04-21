import { describe, it, expect } from 'vitest'
import { memberSchema, membershipSchema, getMembersResponseSchema } from '@/schemas/member.dto'

describe('memberSchema', () => {
  it('valide un membre correct', () => {
    const result = memberSchema.parse({ id: 1, username: 'alex' })
    expect(result.id).toBe(1)
  })

  it('rejette sans username', () => {
    expect(() => memberSchema.parse({ id: 1 })).toThrow()
  })
})

describe('membershipSchema', () => {
  it('valide un rôle owner', () => {
    const result = membershipSchema.parse({ id: 1, role: 'server_owner', members: { id: 1, username: 'alex' } })
    expect(result.role).toBe('server_owner')
  })

  it('rejette un rôle invalide', () => {
    expect(() => membershipSchema.parse({ id: 1, role: 'unknown', members: { id: 1, username: 'alex' } })).toThrow()
  })
})

describe('getMembersResponseSchema', () => {
  it('valide une réponse paginée', () => {
    const result = getMembersResponseSchema.parse({
      data: [{ id: 1, role: 'server_member', members: { id: 1, username: 'alex' } }],
      meta: { page: 1, limit: 10, total: 1, totalPages: 1, hasNextPage: false, hasPreviousPage: false },
    })
    expect(result.meta.total).toBe(1)
  })
})
