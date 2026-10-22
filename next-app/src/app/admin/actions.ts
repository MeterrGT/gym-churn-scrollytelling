'use server';

import { logout, validateSession } from '@/lib/auth';
import { sql } from '@/lib/db';
import { logAudit } from '@/lib/audit';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

/**
 * Oturumu güvenli biçimde sonlandırır (veritabanından siler ve çerezi temizler)
 * ardından /giris sayfasına yönlendirir.
 */
export async function logoutAction(): Promise<void> {
  await logout();
  redirect('/giris');
}

/**
 * İletişim mesajının okundu durumunu günceller ve ilgili sayfaları yeniden doğrular.
 */
export async function toggleMessageReadStatus(
  messageId: number,
  currentStatus: boolean
): Promise<void> {
  const session = await validateSession();
  if (!session) {
    redirect('/giris');
  }

  await sql`
    UPDATE iletisim_mesajlari
    SET okundu = ${!currentStatus}
    WHERE id = ${messageId}
  `;

  await logAudit({
    yoneticiId: session.user.id,
    islem: 'guncelle',
    tabloAdi: 'iletisim_mesajlari',
    kayitId: messageId,
  });

  revalidatePath('/admin');
  revalidatePath('/admin/mesajlar');
}
