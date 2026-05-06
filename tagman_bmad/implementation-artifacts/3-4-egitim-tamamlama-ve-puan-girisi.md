# Story 3.4: Egitim Tamamlama ve Puan Girisi

## Metadata
- **Epic:** 3 - Egitim Yonetimi ve Degerlendirme
- **Story:** 3.4
- **Status:** ready-for-dev
- **Priority:** High
- **Depends on:** 3.2

## User Story

Koordinator olarak,
Bir egitimi tamamlandi olarak isaretleyip puan girmek istiyorum,
Boylece egitmen performans verisi sisteme islensin.

## Kabul Kriterleri

**AC1 - Puan Zorunlulugu**
- `Given` planned bir egitim
- `When` puan girmeden tamamlamaya calisirsam
- `Then` gonderim engellenir ve `Puan zorunludur` hatasi gosterilir

**AC2 - Tamamlama ve Evaluation Kaydi**
- `Given` 1-10 arasi puan
- `When` onaylarsam
- `Then` egitim `completed` olur, puan Evaluation'a kaydolur

**AC3 - Puan Araligi**
- `Given` 1-10 disinda puan
- `When` onaylamaya calisirsam
- `Then` validasyon hatasi gosterilir

**AC4 - Co-trainer Yansitma**
- `Given` birden fazla atanmis egitmen
- `When` egitimi tamamlarim
- `Then` tek puan tum atanan egitmenlere ayri Evaluation kaydi olarak yazilir

## Teknik Kapsam

- `src/app/api/trainings/[id]/complete/route.ts`
- `src/app/api/evaluations/route.ts` (veya complete route icinde write)
- `src/models/Training.ts`
- `src/models/Evaluation.ts`

## Uygulama Gorevleri

1. Complete endpoint'ini durum makinesiyle yaz (`planned -> completed`).
2. Puan validasyonunu Zod ile uygula.
3. Primary ve co-trainer icin Evaluation kayitlarini olustur.
4. Tamamlama sonrasi ilgili query cache invalidation planini bagla.

## Test Checklist

- [ ] Puan olmadan complete engelleniyor
- [ ] 1-10 arasi puanla complete basarili
- [ ] 1-10 disi puan reddediliyor
- [ ] Co-trainer'lara Evaluation yaziliyor

## Definition of Done

- Tum kabul kriterleri saglanmis olmali.
- Egitim durumu ve degerlendirme kayitlari tutarli olmali.
