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
 * Mesajın okundu / okunmadı durumunu günceller
 */
export async function toggleMessageStatusAction(
  messageId: number,
  currentStatus: boolean
): Promise<ActionResponse> {
  const session = await validateSession();
  if (!session) {
    return { error: 'Yetkisiz erişim. Lütfen oturum açın.' };
  }

  if (typeof messageId !== 'number' || isNaN(messageId) || messageId <= 0) {
    return { error: 'Geçersiz mesaj ID.' };
  }

  try {
    const result = await sql`
      UPDATE iletisim_mesajlari
      SET okundu = ${!currentStatus}
      WHERE id = ${messageId}
      RETURNING id, okundu
    `;

    if (result.length === 0) {
      return { error: 'Mesaj bulunamadı.' };
    }

    // Denetim günlüğüne kaydet
    await logAudit({
      yoneticiId: session.user.id,
      islem: 'guncelle',
      tabloAdi: 'iletisim_mesajlari',
      kayitId: messageId,
    });

    revalidatePath('/admin/mesajlar');
    revalidatePath('/admin');

    return {
      success: true,
      message: `Mesaj durumu "${result[0].okundu ? 'Okundu' : 'Okunmadı'}" olarak güncellendi.`,
    };
  } catch (err) {
    console.error('Mesaj durumu güncelleme hatası:', err instanceof Error ? err.message : 'Bilinmeyen hata');
    return { error: 'Mesaj durumu güncellenirken bir hata oluştu.' };
  }
}

/**
 * Mesajı kalıcı olarak siler
 */
export async function deleteMessageAction(messageId: number): Promise<ActionResponse> {
  const session = await validateSession();
  if (!session) {
    return { error: 'Yetkisiz erişim. Lütfen oturum açın.' };
  }

  if (typeof messageId !== 'number' || isNaN(messageId) || messageId <= 0) {
    return { error: 'Geçersiz mesaj ID.' };
  }

  try {
    const result = await sql`
      DELETE FROM iletisim_mesajlari
      WHERE id = ${messageId}
      RETURNING id, ad_soyad
    `;

    if (result.length === 0) {
      return { error: 'Silinecek mesaj bulunamadı.' };
    }

    // Denetim günlüğüne kaydet
    await logAudit({
      yoneticiId: session.user.id,
      islem: 'sil',
      tabloAdi: 'iletisim_mesajlari',
      kayitId: messageId,
    });

    revalidatePath('/admin/mesajlar');
    revalidatePath('/admin');

    return { success: true, message: `"${result[0].ad_soyad}" kişisine ait mesaj silindi.` };
  } catch (err) {
    console.error('Mesaj silme hatası:', err instanceof Error ? err.message : 'Bilinmeyen hata');
    return { error: 'Mesaj silinirken bir hata oluştu.' };
  }
}
