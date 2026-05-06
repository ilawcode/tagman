# Story 3.5: Aggregation API ve Stats Hook

## Metadata
- **Epic:** 3 - Egitim Yonetimi ve Degerlendirme
- **Story:** 3.5
- **Status:** ready-for-dev
- **Priority:** High
- **Depends on:** 3.4

## User Story

Koordinator olarak,
Egitmen degerlendirme verilerini hesaplayan bir API endpoint'i ve React Query hook'u istiyorum,
Boylece profil ve arama ekranlari guncel istatistik verisini kullanabilsin.

## Kabul Kriterleri

**AC1 - Stats Endpoint (Dolu Veri)**
- `Given` `GET /api/trainers/[id]/stats`
- `When` tamamlanmis degerlendirmeler varsa
- `Then` `{ averageScore, trainingCountByYear[] }` doner; averageScore 1 basamak yuvarlanir

**AC2 - Stats Endpoint (Bos Veri)**
- `Given` endpoint cagrisi
- `When` degerlendirme yoksa
- `Then` `{ averageScore: null, trainingCountByYear: [] }` doner

**AC3 - React Query Hook**
- `Given` `useTrainerStats(trainerId)` hook'u
- `When` yeni Evaluation kaydi olusursa
- `Then` `['trainers', id, 'stats']` cache invalidate edilir

**AC4 - Performans ve Aggregation**
- `Given` averageScore hesabi
- `When` server tarafinda islenirse
- `Then` MongoDB aggregation pipeline kullanilir, N+1 olusmaz

## Teknik Kapsam

- `src/app/api/trainers/[id]/stats/route.ts`
- `src/hooks/useTrainerStats.ts`
- `src/models/Evaluation.ts`
- `src/models/Training.ts`

## Uygulama Gorevleri

1. Stats endpoint'i icin aggregation pipeline yaz.
2. Bos veri donusu icin null/empty davranisini sabitle.
3. React Query hook'unu ekle.
4. Evaluation yazimlarinda stats key invalidation'i bagla.

## Test Checklist

- [ ] Dolu veri icin averageScore ve yillik sayim donuyor
- [ ] Bos veri icin null/empty donuyor
- [ ] Hook cache key dogru
- [ ] Evaluation sonrasi stats yenileniyor

## Definition of Done

- Tum kabul kriterleri saglanmis olmali.
- Profil/arama tarafi bu hook'u tuketebilecek durumda olmali.
