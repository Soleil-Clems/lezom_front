import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act, waitFor } from '@testing-library/react'
import { renderHookWithQuery } from '../../utils/renderWithQuery'
import { updateUserRequest, updatePictureRequest } from '@/requests/userRequest'
import { toast } from 'sonner'

vi.mock('@/requests/userRequest', () => ({
  updateUserRequest: vi.fn(),
  updatePictureRequest: vi.fn(),
  getUserRequest: vi.fn(),
  searchUsersRequest: vi.fn(),
}))
vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }))

import { useEditProfil } from '@/hooks/mutations/useEditProfil'
import { useEditProfilPicture } from '@/hooks/mutations/useEditProfilPicture'

describe('useEditProfil callbacks', () => {
  beforeEach(() => vi.clearAllMocks())

  it('onSuccess appelle toast.success', async () => {
    vi.mocked(updateUserRequest).mockResolvedValue({} as any)
    const { result } = renderHookWithQuery(() => useEditProfil(1))
    await act(async () => {
      await result.current.mutateAsync({ username: 'alice' } as any)
    })
    await waitFor(() => expect(vi.mocked(toast.success)).toHaveBeenCalledWith('Profil mis à jour !'))
  })

  it('onError appelle toast.error', async () => {
    vi.mocked(updateUserRequest).mockRejectedValue(new Error('Erreur profil'))
    const { result } = renderHookWithQuery(() => useEditProfil(1))
    await act(async () => { try { await result.current.mutateAsync({} as any) } catch {} })
    await waitFor(() => expect(vi.mocked(toast.error)).toHaveBeenCalled())
  })
})

describe('useEditProfilPicture callbacks', () => {
  beforeEach(() => vi.clearAllMocks())

  it('onSuccess appelle toast.success', async () => {
    vi.mocked(updatePictureRequest).mockResolvedValue({} as any)
    const { result } = renderHookWithQuery(() => useEditProfilPicture(1))
    const mockFile = new File(['data'], 'avatar.png', { type: 'image/png' })
    await act(async () => { await result.current.mutateAsync(mockFile) })
    await waitFor(() => expect(vi.mocked(toast.success)).toHaveBeenCalledWith('Photo de profil mise à jour !'))
  })

  it('onError appelle toast.error', async () => {
    vi.mocked(updatePictureRequest).mockRejectedValue(new Error('Fichier trop grand'))
    const { result } = renderHookWithQuery(() => useEditProfilPicture(1))
    const mockFile = new File(['data'], 'avatar.png', { type: 'image/png' })
    await act(async () => { try { await result.current.mutateAsync(mockFile) } catch {} })
    await waitFor(() => expect(vi.mocked(toast.error)).toHaveBeenCalled())
  })
})
