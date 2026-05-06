# Story 3.1: Egitim Tanimlama Wizard Temel Bilgiler

## Metadata
- **Epic:** 3 - Egitim Yonetimi ve Degerlendirme
- **Story:** 3.1
- **Status:** ready-for-dev
- **Priority:** High
- **Depends on:** 2.2

## User Story

Koordinator olarak,
Yeni bir egitimi konu, tarih, sure ve konum bilgileriyle wizard akisinda tanimlamak istiyorum,
Boylece egitmen atamasina hazir bir planli egitim olussun.

## Kabul Kriterleri

**AC1 - Wizard Temel Akis**
- `Given` `/trainings/new` wizard'i
- `When` 1. adim (konu, tarih, sure) ve 2. adim (opsiyonel notlar) tamamlanirsa
- `Then` egitim `planned` durumunda kaydedilir ve 3. adima gecilir

**AC2 - Zorunlu Alan Kontrolu**
- `Given` konu veya tarih eksik
- `When` sonraki adima gecmeye calisirsam
- `Then` validasyon hatasi gosterilir, gecis engellenir

**AC3 - Liste Gorunurlugu**
- `Given` egitim planned durumda kaydedildi
- `When` egitim listesine bakarsam
- `Then` konu, tarih ve `Planlandi` durumu gorunur

## Teknik Kapsam

- `src/app/(protected)/trainings/new/page.tsx`
- `src/components/features/trainings/TrainingWizard*.tsx`
- `src/app/api/trainings/route.ts`
- `src/models/Training.ts`
- `src/lib/schemas/training.schema.ts`

## Uygulama Gorevleri

1. Training modeli ve create schema'sini tamamla.
2. Wizard adim state yonetimini kur.
3. Create training API route'unu yaz.
4. Planned durumunda kayit ve listelemeyi bagla.

## Test Checklist

- [ ] Wizard adim 1-2 kaydi calisiyor
- [ ] Zorunlu alan validasyonu calisiyor
- [ ] Kayit sonrasi egitim planned listeleniyor

## Definition of Done

- Tum kabul kriterleri saglanmis olmali.
- Wizard akisi kesintisiz calismali.
