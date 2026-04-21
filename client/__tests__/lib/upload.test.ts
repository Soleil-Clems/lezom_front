import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/customFetch', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

import { upload, uploadMultiple } from '@/lib/upload';
import customfetch from '@/lib/customFetch';

const makeFile = (name: string, type: string) => new File(['content'], name, { type });

describe('upload', () => {
  beforeEach(() => vi.clearAllMocks());

  it('upload une image avec la catégorie img', async () => {
    vi.mocked(customfetch.post).mockResolvedValue({ url: 'u', key: 'k' });
    await upload(makeFile('photo.png', 'image/png'));
    expect(customfetch.post).toHaveBeenCalledWith('dms/upload', expect.any(FormData));
  });

  it('utilise la catégorie fournie si spécifiée', async () => {
    vi.mocked(customfetch.post).mockResolvedValue({ url: 'u', key: 'k' });
    await upload(makeFile('doc.pdf', 'application/pdf'), 'pdf');
    const formData = vi.mocked(customfetch.post).mock.calls[0][1] as FormData;
    expect(formData.get('category')).toBe('pdf');
  });

  it('détecte la catégorie audio pour un fichier mp3', async () => {
    vi.mocked(customfetch.post).mockResolvedValue({ url: 'u', key: 'k' });
    await upload(makeFile('audio.mp3', 'audio/mpeg'));
    const formData = vi.mocked(customfetch.post).mock.calls[0][1] as FormData;
    expect(formData.get('category')).toBe('voice');
  });

  it('détecte la catégorie pdf pour un fichier pdf', async () => {
    vi.mocked(customfetch.post).mockResolvedValue({ url: 'u', key: 'k' });
    await upload(makeFile('doc.pdf', 'application/pdf'));
    const formData = vi.mocked(customfetch.post).mock.calls[0][1] as FormData;
    expect(formData.get('category')).toBe('pdf');
  });

  it('détecte la catégorie file par défaut', async () => {
    vi.mocked(customfetch.post).mockResolvedValue({ url: 'u', key: 'k' });
    await upload(makeFile('doc.docx', 'application/msword'));
    const formData = vi.mocked(customfetch.post).mock.calls[0][1] as FormData;
    expect(formData.get('category')).toBe('file');
  });
});

describe('uploadMultiple', () => {
  it('upload plusieurs fichiers en parallèle', async () => {
    vi.mocked(customfetch.post).mockResolvedValue({ url: 'u', key: 'k' });
    const files = [makeFile('a.png', 'image/png'), makeFile('b.png', 'image/png')];
    const results = await uploadMultiple(files);
    expect(results).toHaveLength(2);
  });
});
