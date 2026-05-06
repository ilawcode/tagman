# Story 4.4: Onerilen Egitmenler

## Metadata
- **Epic:** 4 - Egitmen Arama, Kesif ve Profil
- **Story:** 4.4
- **Status:** ready-for-dev
- **Priority:** High
- **Depends on:** 3.2, 3.5, 4.1

## User Story

Koordinator olarak,
Egitim konusu icin uygun ve o tarihte musait egitmenlerin otomatik onerilmesini istiyorum,
Boylece en uygun egitmeni hizlica atayabileyim.

## Kabul Kriterleri

1. Wizard adim 3 yuklenirken konu + tarih baglaminda uygun aktif ve musait egitmenler puana gore azalan listelenir.
2. Oneri secimi atama alanini on doldurur.
3. Uygun egitmen yoksa bos mesaj gorunur.
4. Oneri sorgusu 1.5 saniye altinda tamamlanir.

## Teknik Kapsam

- `src/app/api/trainers/recommended/route.ts`
- `src/components/features/search/RecommendedTrainers.tsx`
- `src/components/features/trainings/TrainingWizardStep3.tsx`
- `src/models/Trainer.ts`
- `src/models/Training.ts`

## Uygulama Gorevleri

1. Recommended API sorgusunu skill + musaitlik + puan siralamasiyla yaz.
2. Wizard adim 3'e oneriler panelini ekle.
3. Secimle atama alanlarini prefille.
4. Timeout/perf olcumunu takip et.

## Test Checklist

- [ ] Oneri listesi dogru sirada
- [ ] Musaitlik kontrolu dogru
- [ ] Secim prefill calisiyor
- [ ] Bos durum mesaji calisiyor

## Definition of Done

- Tum kabul kriterleri saglanmis olmali.
- Story 3.2 ile uyumlu sekilde adim 3'e entegre olmali.
