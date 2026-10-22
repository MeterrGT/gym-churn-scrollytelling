import { sql } from './db';

export type AuditAction = 'giris' | 'cikis' | 'ekle' | 'guncelle' | 'sil';

export interface AuditLogParams {
  yoneticiId: number | null;
  islem: AuditAction;
  tabloAdi?: string | null;
  kayitId?: number | null;
}

/**
 * Yönetici işlemlerini (islem_kayitlari tablosu) parametreli sorguyla kaydeder.
 */
export async function logAudit({
  yoneticiId,
  islem,
  tabloAdi = null,
  kayitId = null,
}: AuditLogParams): Promise<void> {
  try {
    await sql`
      INSERT INTO islem_kayitlari (yonetici_id, islem, tablo_adi, kayit_id, zaman)
      VALUES (${yoneticiId}, ${islem}, ${tabloAdi}, ${kayitId}, NOW())
    `;
  } catch (error) {
    console.error('Denetim günlüğü kayıt hatası:', error instanceof Error ? error.message : 'Bilinmeyen hata');
  }
}
