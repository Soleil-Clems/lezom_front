import { describe, it, expect } from 'vitest'
import { LoginSchema, RegisterSchema, passwordSchema } from '@/schemas/auth.dto'

describe('passwordSchema', () => {
  it('accepte un mot de passe >= 8 caractères', () => {
    expect(passwordSchema.parse('password1')).toBe('password1')
  })

  it('rejette un mot de passe < 8 caractères', () => {
    expect(() => passwordSchema.parse('short')).toThrow()
  })
})

describe('LoginSchema', () => {
  it('valide un login correct', () => {
    const result = LoginSchema.parse({ email: 'user@test.com', password: 'password123' })
    expect(result.email).toBe('user@test.com')
  })

  it('rejette un email invalide', () => {
    expect(() => LoginSchema.parse({ email: 'not-an-email', password: 'password123' })).toThrow()
  })

  it('rejette un mot de passe vide', () => {
    expect(() => LoginSchema.parse({ email: 'user@test.com', password: '' })).toThrow()
  })

  it('accepte un captchaToken optionnel', () => {
    const result = LoginSchema.parse({ email: 'user@test.com', password: 'password123', captchaToken: 'tok' })
    expect(result.captchaToken).toBe('tok')
  })
})

describe('RegisterSchema', () => {
  const valid = {
    firstname: 'Jean',
    lastname: 'Dupont',
    username: 'jdupont',
    email: 'jean@test.com',
    password: 'password123',
    birthdate: '2000-01-01',
  }

  it('valide un register correct', () => {
    const result = RegisterSchema.parse(valid)
    expect(result.username).toBe('jdupont')
  })

  it('rejette un prénom trop court', () => {
    expect(() => RegisterSchema.parse({ ...valid, firstname: 'J' })).toThrow()
  })

  it('rejette un nom trop court', () => {
    expect(() => RegisterSchema.parse({ ...valid, lastname: 'D' })).toThrow()
  })

  it('rejette un pseudo trop court', () => {
    expect(() => RegisterSchema.parse({ ...valid, username: 'ab' })).toThrow()
  })

  it('rejette un email invalide', () => {
    expect(() => RegisterSchema.parse({ ...valid, email: 'bad' })).toThrow()
  })

  it('rejette un mot de passe trop court', () => {
    expect(() => RegisterSchema.parse({ ...valid, password: 'short' })).toThrow()
  })

  it('rejette une date de naissance vide', () => {
    expect(() => RegisterSchema.parse({ ...valid, birthdate: '' })).toThrow()
  })
})
