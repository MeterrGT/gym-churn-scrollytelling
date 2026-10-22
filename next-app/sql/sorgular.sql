-- Görev 3.1: 10 dakikadan kısa ve 1000'den fazla izlenmiş videolar
SELECT *
FROM videolar
WHERE sure_dk < 10
  AND izlenme > 1000;


-- Görev 3.2: En çok izlenen 5 video
SELECT id, baslik, izlenme
FROM videolar
ORDER BY izlenme DESC
LIMIT 5;


-- Görev 3.3: Toplam tahmini izlenme süresi (saat)
SELECT SUM(sure_dk * izlenme) / 60.0 AS toplam_izlenme_saati
FROM videolar;


-- Görev 3.4: Her oynatma listesinde kaç video var?
SELECT
    ol.ad AS oynatma_listesi,
    COUNT(v.id) AS video_sayisi
FROM oynatma_listeleri ol
LEFT JOIN videolar v ON v.kategori_id = ol.id
GROUP BY ol.id, ol.ad
ORDER BY ol.id;


-- Görev 3.5: Öğrenci numarasını ILIKE ile bul
SELECT id, baslik
FROM videolar
WHERE baslik ILIKE '%2516016026%';


-- Görev 3.6: Video adresi boş olan kayıtları yayından kaldır
UPDATE videolar
SET yayinda = FALSE
WHERE video_url IS NULL
   OR TRIM(video_url) = '';


-- Görev 3.7: 10'dan az izlenmiş ve bir yıldan eski videoları sil
DELETE FROM videolar
WHERE izlenme < 10
  AND yayin_tarihi < CURRENT_DATE - INTERVAL '1 year'
RETURNING id, baslik, izlenme, yayin_tarihi;


-- Görev 3.8: Son 7 gündeki işlem türüne göre denetim kaydı sayıları
SELECT islem, COUNT(*) AS islem_sayisi
FROM islem_kayitlari
WHERE zaman >= CURRENT_TIMESTAMP - INTERVAL '7 days'
GROUP BY islem
ORDER BY islem_sayisi DESC;