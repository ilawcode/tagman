# Story 3.3: Egitim Iptali

## Metadata
- **Epic:** 3 - Egitim Yonetimi ve Degerlendirme
- **Story:** 3.3
- **Status:** ready-for-dev
- **Priority:** Medium
- **Depends on:** 3.2

## User Story

Koordinator olarak,
Bir egitimi iptal edip iptal notu eklemek istiyorum,
Boylece kayit korunurken takvimde dogru sekilde gorunsun.

## Kabul Kriterleri

**AC1 - Iptal ve Not**
- `Given` planned durumunda bir egitim
- `When` iptal edip not girersem
- `Then` egitim `cancelled` olur, not saklanir, kayit silinmez

**AC2 - Gorsel Ayrisim**
- `Given` egitim iptal edilmis
- `When` liste/takvimde goruntulenirse
- `Then` aktif egitimlerden gorsel olarak ayrisir

**AC3 - Cakisma Blogu Kaldirma**
- `Given` iptal edilen egitim
- `When` ayni tarihte musaitlik kontrolu yaparsam
- `Then` ilgili cakisma blogu kalkmis olur

**AC4 - Not Zorunlulugu**
- `Given` iptal notu bos
- `When` iptal gonderirsem
- `Then` validasyon hatasi gosterilir

## Teknik Kapsam

- `src/app/api/trainings/[id]/cancel/route.ts`
- `src/models/Training.ts`
- `src/components/features/trainings/*`

## Uygulama Gorevleri

1. Cancel endpoint'ini durum makinesiyle yaz (`planned -> cancelled`).
2. Iptal notunu zorunlu schema alanina ekle.
3. UI'da iptal islemi ve geri bildirim akislarini uygula.
4. Cakisma kontrolu sorgusunda cancelled kayitlari haric tut.

## Test Checklist

- [ ] Not ile iptal calisiyor
- [ ] Not olmadan iptal engelleniyor
- [ ] Cancelled kayitlar silinmiyor
- [ ] Musaitlik kontrolu iptal kayitlarini bloklamiyor

## Definition of Done

- Tum kabul kriterleri saglanmis olmali.
- Iptal davranisi veri butunlugunu korumali.
