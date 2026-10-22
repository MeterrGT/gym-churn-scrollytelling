import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { cookies, headers } from 'next/headers';
import { sql } from './db';
import { logAudit } from './audit';

export const SESSION_COOKIE_NAME = 'admin_session';
export const SESSION_EXPIRY_HOURS = 2;
export const SESSION_EXPIRY_MS = SESSION_EXPIRY_HOURS * 60 * 60 * 1000;

export interface AdminUser {
  id: number;
  eposta: string;
  son_giris: string | null;
  son_giris_ip: string | null;
}

export interface SessionData {
  token: string;
  user: AdminUser;
}

/**
 * 32 baytlık rastgele baytlardan kriptografik olarak güvenli oturum belirteci (token) üretir.
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * bcryptjs ile şifre doğrulaması yapar.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch (err) {
    console.error('Şifre doğrulama hatası:', err instanceof Error ? err.message : 'Bilinmeyen hata');
    return false;
  }
}

/**
 * Yeni yöneticiler için şifreyi bcrypt ile hash'ler. Asla düz metin şifre saklanmaz.
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Güvenli ve doğrulanmış istemci IP adresini döndürür.
 * İstemci başlıklarını körü körüne kabul etmez, geçerli IPv4 / IPv6 formatını denetler.
 */
export async function getClientIp(): Promise<string> {
  try {
    const headerList = await headers();
    const cfConnectingIp = headerList.get('cf-connecting-ip');
    const xForwardedFor = headerList.get('x-forwarded-for');
    const xRealIp = headerList.get('x-real-ip');

    let candidate = '';
    if (cfConnectingIp) {
      candidate = cfConnectingIp.trim();
    } else if (xForwardedFor) {
      candidate = xForwardedFor.split(',')[0].trim();
    } else if (xRealIp) {
      candidate = xRealIp.trim();
    }

    const ipv4Pattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Pattern = /^[a-fA-F0-9:]+$/;

    if (candidate && (ipv4Pattern.test(candidate) || (ipv6Pattern.test(candidate) && candidate.includes(':')))) {
      return candidate;
    }
  } catch {
    // Hata durumunda güvenli yerel varsayılan
  }

  return '127.0.0.1';
}

/**
 * Veritabanında (oturumlar tablosu) 2 saat süreli yeni bir oturum kaydı oluşturur
 * ve yöneticinin son başarılı giriş zamanı ile IP adresini günceller.
 */
export async function createSession(yoneticiId: number, ipAddress?: string): Promise<string> {
  const token = generateSessionToken();
  const bitis = new Date(Date.now() + SESSION_EXPIRY_MS);
  const clientIp = ipAddress || (await getClientIp());

  await sql`
    INSERT INTO oturumlar (token, yonetici_id, bitis)
    VALUES (${token}, ${yoneticiId}, ${bitis.toISOString()})
  `;

  // Yöneticinin son giriş zamanını ve IP adresini güncelle
  await sql`
    UPDATE yoneticiler
    SET 
      son_giris = NOW(),
      son_giris_ip = ${clientIp}
    WHERE id = ${yoneticiId}
  `;

  return token;
}


/**
 * İstemciye httpOnly, güvenli session çerezini yazar.
 */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  const bitis = new Date(Date.now() + SESSION_EXPIRY_MS);

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_EXPIRY_HOURS * 60 * 60, // 7200 saniye (2 saat)
    expires: bitis,
  });
}

/**
 * Çerezi temizler.
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Her korumalı admin isteğinde veritabanına karşı oturumun geçerliliğini ve süresini denetler.
 */
export async function validateSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token || typeof token !== 'string' || token.trim().length === 0) {
    return null;
  }

  try {
    // Parametreli sorgu ile oturumlar ve yoneticiler tablolarını doğrula
    const rows = await sql`
      SELECT 
        o.token,
        o.bitis,
        y.id,
        y.eposta,
        y.son_giris,
        y.son_giris_ip
      FROM oturumlar o
      INNER JOIN yoneticiler y ON o.yonetici_id = y.id
      WHERE o.token = ${token}
        AND o.bitis > NOW()
      LIMIT 1
    `;

    if (!rows || rows.length === 0) {
      // Süresi geçmiş veya veritabanında bulunmayan oturum
      return null;
    }

    const row = rows[0];
    return {
      token: row.token,
      user: {
        id: row.id,
        eposta: row.eposta,
        son_giris: row.son_giris,
        son_giris_ip: row.son_giris_ip,
      },
    };
  } catch (error) {
    console.error('Veritabanı oturum doğrulama hatası:', error instanceof Error ? error.message : 'Bilinmeyen hata');
    return null;
  }
}


/**
 * Oturumu hem veritabanından siler hem de istemci çerezini temizler.
 * Çıkış işlemini denetim günlüğüne ('cikis') kaydeder.
 */
export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    try {
      const activeRows = await sql`
        SELECT yonetici_id FROM oturumlar WHERE token = ${token} LIMIT 1
      `;
      const yoneticiId = activeRows[0]?.yonetici_id ?? null;

      await sql`
        DELETE FROM oturumlar
        WHERE token = ${token}
      `;

      if (yoneticiId) {
        await logAudit({
          yoneticiId,
          islem: 'cikis',
          tabloAdi: null,
          kayitId: null,
        });
      }
    } catch (error) {
      console.error('Veritabanı oturum silme hatası:', error instanceof Error ? error.message : 'Bilinmeyen hata');
    }
  }

  await clearSessionCookie();
}

/**
 * Yönetici kimlik bilgilerini parametreli sorgu ve bcrypt ile güvenle doğrular.
 * E-posta veya şifrenin hangisinin hatalı olduğunu açık etmez.
 * Başarılı girişi denetim günlüğüne ('giris') kaydeder.
 */
export async function authenticateAdmin(
  eposta: string,
  sifre: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const cleanEmail = (eposta || '').trim().toLowerCase();
    const cleanPassword = sifre || '';

    if (!cleanEmail || !cleanPassword) {
      return { success: false, error: 'E-posta veya şifre hatalı' };
    }

    // Parametreli sorgu: Asla kullanıcı girdisini SQL dizesine birleştirmiyoruz
    const rows = await sql`
      SELECT id, eposta, sifre_hash
      FROM yoneticiler
      WHERE LOWER(eposta) = ${cleanEmail}
      LIMIT 1
    `;

    if (!rows || rows.length === 0) {
      // Zamanlama saldırılarını (timing attack) önlemek için sabit kukla (dummy) hash karşılaştırması.
      // Bu değer gerçek bir yöneticiye ait bir sır veya parola hash'i DEĞİLDİR.
      // Kullanıcının sistemde var olup olmadığını sunucu yanıt süresindeki farktan tespit etmeye
      // çalışan saldırganlara karşı zamanlama tutarlılığı (constant-time behavior) sağlamak için
      // yapay olarak kullanılan sabit bir şablondur.
      await bcrypt.compare(
        cleanPassword,
        '$2a$12$e80n9e88zS0000000000000000000000000000000000000000000'
      );
      return { success: false, error: 'E-posta veya şifre hatalı' };
    }

    const yonetici = rows[0];
    const passwordMatch = await verifyPassword(cleanPassword, yonetici.sifre_hash);

    if (!passwordMatch) {
      return { success: false, error: 'E-posta veya şifre hatalı' };
    }

    // Başarılı kimlik doğrulama: oturum oluştur ve çerezi yaz
    const sessionToken = await createSession(yonetici.id);
    await setSessionCookie(sessionToken);

    // Giriş işlemini denetim günlüğüne kaydet
    await logAudit({
      yoneticiId: yonetici.id,
      islem: 'giris',
      tabloAdi: 'yoneticiler',
      kayitId: yonetici.id,
    });

    return { success: true };
  } catch (error) {
    console.error('Giriş doğrulama hatası:', error instanceof Error ? error.message : 'Bilinmeyen hata');
    return { success: false, error: 'E-posta veya şifre hatalı' };
  }
}

