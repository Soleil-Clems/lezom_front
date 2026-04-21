import { describe, it, expect, vi } from 'vitest';
import { renderHookWithQuery } from '../../utils/renderWithQuery';
import { useBanUser, useUnbanUser } from '@/hooks/mutations/useBanManagement';

vi.mock('@/requests/banRequest', () => ({
  banUserRequest: vi.fn(),
  unbanUserRequest: vi.fn(),
  getBannedUsersRequest: vi.fn(),
}));

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

vi.mock('next-intl', () => ({ useTranslations: () => (k: string) => k }));

describe('useBanManagement', () => {
  it('useBanUser expose mutate', () => {
    const { result } = renderHookWithQuery(() => useBanUser());
    expect(result.current).toHaveProperty('mutate');
    expect(result.current.status).toBe('idle');
  });

  it('useUnbanUser expose mutate', () => {
    const { result } = renderHookWithQuery(() => useUnbanUser());
    expect(result.current).toHaveProperty('mutate');
    expect(result.current.status).toBe('idle');
  });
});
