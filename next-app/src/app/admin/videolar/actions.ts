'use server';

import { validateSession } from '@/lib/auth';
import { sql } from '@/lib/db';
import { logAudit } from '@/lib/audit';
import { revalidatePath } from 'next/cache';

export interface ActionResponse {
  success?: boolean;
  message?: string;
  error?: string;
}

/**
 * Girdi doğrulama ve temizleme yardımcısı
 */
function validateVideoInput(formData: FormData) {
  const baslik = (formData.get('baslik') as string)?.trim();
  if (!baslik || baslik.length < 2) {
    return { error: 'Video başlığı en az 2 karakter olmalıdır.' };
  }

  const rawUrl = (formData.get('video_url') as string)?.trim();
  let video_url: string | null = null;
  if (rawUrl) {
    try {
      new URL(rawUrl);
      video_url = rawUrl;
    } catch {
      return { error: 'Lütfen geçerli bir URL adresi girin (örn. https://youtube.com/...).' };
    }
  }

  const rawSure = (formData.get('sure_dk') as string)?.trim();
  let sure_dk: number | null = null;
  if (rawSure) {
    const parsedSure = parseInt(rawSure, 10);
    if (isNaN(parsedSure) || parsedSure < 0) {
      return { error: 'Süre sıfır veya pozitif bir tam sayı olmalıdır.' };
    }
    sure_dk = parsedSure;
  }

  const rawIzlenme = (formData.get('izlenme') as string)?.trim();
  let izlenme = 0;
  if (rawIzlenme) {
    const parsedIzlenme = parseInt(rawIzlenme, 10);
    if (isNaN(parsedIzlenme) || parsedIzlenme < 0) {
      return { error: 'İzlenme sayısı sıfır veya pozitif bir tam sayı olmalıdır.' };
    }
    izlenme = parsedIzlenme;
  }

  const rawTarih = (formData.get('yayin_tarihi') as string)?.trim();
  let yayin_tarihi: string | null = null;
  if (rawTarih) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(rawTarih)) {
      return { error: 'Yayın tarihi YYYY-AA-GG formatında olmalıdır.' };
    }
    yayin_tarihi = rawTarih;
  }

  const rawKatId = (formData.get('kategori_id') as string)?.trim();
  let kategori_id: number | null = null;
  if (rawKatId && rawKatId !== '0') {
    const parsedKatId = parseInt(rawKatId, 10);
    if (!isNaN(parsedKatId) && parsedKatId > 0) {
      kategori_id = parsedKatId;
    }
  }

  const yayinda = formData.get('yayinda') === 'on' || formData.get('yayinda') === 'true';

  return {
    values: {
      baslik,
      video_url,
      sure_dk,
      izlenme,
      yayin_tarihi,
      kategori_id,
      yayinda,
    },
  };
}

/**
 * Yeni video ekleme işlemi
 */
export async function createVideoAction(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const session = await validateSession();
  if (!session) {
    return { error: 'Yetkisiz erişim. Lütfen oturum açın.' };
  }

  const validation = validateVideoInput(formData);
  if (validation.error || !validation.values) {
    return { error: validation.error };
  }

  const { baslik, video_url, sure_dk, izlenme, yayin_tarihi, kategori_id, yayinda } = validation.values;

  try {
    const result = await sql`
      INSERT INTO videolar (baslik, video_url, sure_dk, izlenme, yayin_tarihi, kategori_id, yayinda)
      VALUES (${baslik}, ${video_url}, ${sure_dk}, ${izlenme}, ${yayin_tarihi}, ${kategori_id}, ${yayinda})
      RETURNING id
    `;

    const newId = result[0].id;

    // Denetim günlüğüne kaydet
    await logAudit({
      yoneticiId: session.user.id,
      islem: 'ekle',
      tabloAdi: 'videolar',
      kayitId: newId,
    });

    revalidatePath('/admin/videolar');
    revalidatePath('/admin');
    revalidatePath('/');

    return { success: true, message: `"${baslik}" videosu başarıyla eklendi.` };
  } catch (err) {
    console.error('Video ekleme hatası:', err instanceof Error ? err.message : 'Bilinmeyen hata');
    return { error: 'Video veritabanına eklenirken bir hata oluştu.' };
  }
}

/**
 * Mevcut videoyu güncelleme işlemi
 */
export async function updateVideoAction(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const session = await validateSession();
  if (!session) {
    return { error: 'Yetkisiz erişim. Lütfen oturum açın.' };
  }

  const rawId = (formData.get('id') as string)?.trim();
  const id = parseInt(rawId, 10);
  if (isNaN(id) || id <= 0) {
    return { error: 'Geçersiz video ID.' };
  }

  const validation = validateVideoInput(formData);
  if (validation.error || !validation.values) {
    return { error: validation.error };
  }

  const { baslik, video_url, sure_dk, izlenme, yayin_tarihi, kategori_id, yayinda } = validation.values;

  try {
    const result = await sql`
      UPDATE videolar
      SET 
        baslik = ${baslik},
        video_url = ${video_url},
        sure_dk = ${sure_dk},
        izlenme = ${izlenme},
        yayin_tarihi = ${yayin_tarihi},
        kategori_id = ${kategori_id},
        yayinda = ${yayinda}
      WHERE id = ${id}
      RETURNING id
    `;

    if (result.length === 0) {
      return { error: 'Güncellenecek video bulunamadı.' };
    }

    // Denetim günlüğüne kaydet
    await logAudit({
      yoneticiId: session.user.id,
      islem: 'guncelle',
      tabloAdi: 'videolar',
      kayitId: id,
    });

    revalidatePath('/admin/videolar');
    revalidatePath('/admin');
    revalidatePath('/');

    return { success: true, message: `"${baslik}" videosu başarıyla güncellendi.` };
  } catch (err) {
    console.error('Video güncelleme hatası:', err instanceof Error ? err.message : 'Bilinmeyen hata');
    return { error: 'Video güncellenirken bir hata oluştu.' };
  }
}

/**
 * Videonun yayın durumunu (yayinda: true/false) değiştirme işlemi
 */
export async function toggleVideoPublishAction(
  videoId: number,
  currentStatus: boolean
): Promise<ActionResponse> {
  const session = await validateSession();
  if (!session) {
    return { error: 'Yetkisiz erişim.' };
  }

  try {
    const result = await sql`
      UPDATE videolar
      SET yayinda = ${!currentStatus}
      WHERE id = ${videoId}
      RETURNING id, yayinda
    `;

    if (result.length === 0) {
      return { error: 'Video bulunamadı.' };
    }

    await logAudit({
      yoneticiId: session.user.id,
      islem: 'guncelle',
      tabloAdi: 'videolar',
      kayitId: videoId,
    });

    revalidatePath('/admin/videolar');
    revalidatePath('/admin');
    revalidatePath('/');

    return { success: true };
  } catch (err) {
    console.error('Yayın durumu değiştirme hatası:', err instanceof Error ? err.message : 'Bilinmeyen hata');
    return { error: 'Yayın durumu güncellenemedi.' };
  }
}

/**
 * Video silme işlemi
 */
export async function deleteVideoAction(videoId: number): Promise<ActionResponse> {
  const session = await validateSession();
  if (!session) {
    return { error: 'Yetkisiz erişim.' };
  }

  try {
    const result = await sql`
      DELETE FROM videolar
      WHERE id = ${videoId}
      RETURNING id, baslik
    `;

    if (result.length === 0) {
      return { error: 'Silinecek video bulunamadı.' };
    }

    await logAudit({
      yoneticiId: session.user.id,
      islem: 'sil',
      tabloAdi: 'videolar',
      kayitId: videoId,
    });

    revalidatePath('/admin/videolar');
    revalidatePath('/admin');
    revalidatePath('/');

    return { success: true, message: `"${result[0].baslik}" videosu başarıyla silindi.` };
  } catch (err) {
    console.error('Video silme hatası:', err instanceof Error ? err.message : 'Bilinmeyen hata');
    return { error: 'Video silinirken bir hata oluştu.' };
  }
}
