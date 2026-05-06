# Story 4.2: CSV Export

## Metadata
- **Epic:** 4 - Egitmen Arama, Kesif ve Profil
- **Story:** 4.2
- **Status:** ready-for-dev
- **Priority:** Medium
- **Depends on:** 4.1

## User Story

Koordinator olarak,
Mevcut egitmen arama sonuclarini CSV olarak indirmek istiyorum,
Boylece veriyi harici araclarda kullanabileyim.

## Kabul Kriterleri

1. `CSV Indir` aksiyonu ad, soyad, kurum durumu, danismanlik firmasi, ortalama puan, skill listesi sutunlariyla dosya indirir.
2. Sonuc yoksa buton devre disi olur veya sadece baslik satiri indirilir.
3. Aktif filtreler varsa export sadece filtreli sonucu icerir.

## Teknik Kapsam

- `src/app/api/trainers/export/route.ts`
- `src/lib/csvExport.ts`
- `src/app/(protected)/search/page.tsx`

## Uygulama Gorevleri

1. Export API route'unu filtre parametreleriyle bagla.
2. CSV utility fonksiyonunu yaz.
3. UI buton state'lerini (disabled/loading) bagla.

## Test Checklist

- [ ] CSV sutunlari dogru
- [ ] Filtreli export dogru
- [ ] Bos sonuc davranisi dogru

## Definition of Done

- Tum kabul kriterleri saglanmis olmali.
- UTF-8 ve satir sonu uyumlulugu kontrol edilmis olmali.
