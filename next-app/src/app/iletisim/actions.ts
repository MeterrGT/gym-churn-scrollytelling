'use server';

import { sql } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export interface ContactFormState {
  success?: boolean;
  message?: string;
  error?: string;
  errors?: {
    ad_soyad?: string;
    eposta?: string;
    mesaj?: string;
    kvkk_onay?: string;
  };
}

/**
 * İletişim formu sunucu tarafı veri doğrulama ve kaydetme eylemi
 */
export async function submitContactForm(
  _prevState: ContactFormState | null,
  formData: FormData
): Promise<ContactFormState> {
  const rawAdSoyad = (formData.get('ad_soyad') as string) || '';
  const rawEposta = (formData.get('eposta') as string) || '';
  const rawMesaj = (formData.get('mesaj') as string) || '';
  const rawKvkk = formData.get('kvkk_onay');

  const ad_soyad = rawAdSoyad.trim();
  const eposta = rawEposta.trim().toLowerCase();
  const mesaj = rawMesaj.trim();
  const kvkk_onay = rawKvkk === 'on' || rawKvkk === 'true';

  const errors: { [key: string]: string } = {};

  // 1. Ad Soyad Doğrulama
  if (!ad_soyad || ad_soyad.length < 2) {
    errors.ad_soyad = 'Lütfen adınızı ve soyadınızı belirtiniz (en az 2 karakter).';
  } else if (ad_soyad.length > 100) {
    errors.ad_soyad = 'Ad ve soyad en fazla 100 karakter olabilir.';
  }

  // 2. E-posta Doğrulama
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!eposta || !emailRegex.test(eposta)) {
    errors.eposta = 'Lütfen geçerli bir e-posta adresi giriniz (örn. ornek@alanadi.com).';
  } else if (eposta.length > 120) {
    errors.eposta = 'E-posta adresi en fazla 120 karakter olabilir.';
  }

  // 3. Mesaj Doğrulama
  if (!mesaj || mesaj.length < 10) {
    errors.mesaj = 'Mesajınız en az 10 karakter olmalıdır.';
  } else if (mesaj.length > 3000) {
    errors.mesaj = 'Mesajınız en fazla 3000 karakter olabilir.';
  }

  // 4. KVKK Onay Kontrolü
  if (!kvkk_onay) {
    errors.kvkk_onay = 'Formu gönderebilmek için KVKK Aydınlatma Metnini onaylamanız gerekmektedir.';
  }

  // Hata varsa geri dön
  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      error: 'Lütfen formdaki eksik veya geçersiz alanları kontrol ediniz.',
      errors,
    };
  }

  try {
    // Parametreli SQL sorgusu ile iletisim_mesajlari tablosuna kaydet
    await sql`
      INSERT INTO iletisim_mesajlari (ad_soyad, eposta, mesaj, kvkk_onay, okundu, gonderim_zamani)
      VALUES (${ad_soyad}, ${eposta}, ${mesaj}, true, false, NOW())
    `;

    // Admin panelindeki mesaj listesini ve okunmamış mesaj sayacını anında güncelle
    revalidatePath('/admin');
    revalidatePath('/admin/mesajlar');

    return {
      success: true,
      message: 'Mesajınız başarıyla iletildi! İlginiz için teşekkür ederim, en kısa sürede dönüş yapacağım.',
    };
  } catch (err) {
    console.error('İletişim formu veritabanı kayıt hatası:', err instanceof Error ? err.message : 'Bilinmeyen hata');
    return {
      success: false,
      error: 'Mesajınız kaydedilirken bir sunucu hatası oluştu. Lütfen doğrudan e-posta ile iletişime geçiniz.',
    };
  }
}
