import { describe, it, expect, vi } from 'vitest';
import { renderHookWithQuery } from '../../utils/renderWithQuery';
import { useEditProfilPicture } from '@/hooks/mutations/useEditProfilPicture';

vi.mock('@/requests/userRequest', () => ({
  updatePictureRequest: vi.fn(),
  updateUserRequest: vi.fn(),
  getAuthUserRequest: vi.fn(),
}));
vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

describe('useEditProfilPicture', () => {
  it('expose mutate et status idle', () => {
    const { result } = renderHookWithQuery(() => useEditProfilPicture(1));
    expect(result.current).toHaveProperty('mutate');
    expect(result.current.status).toBe('idle');
  });
});
