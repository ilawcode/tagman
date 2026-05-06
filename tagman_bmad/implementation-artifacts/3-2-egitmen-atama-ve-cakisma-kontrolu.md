# Story 3.2: Egitmen Atama ve Cakisma Kontrolu

## Metadata
- **Epic:** 3 - Egitim Yonetimi ve Degerlendirme
- **Story:** 3.2
- **Status:** ready-for-dev
- **Priority:** High
- **Depends on:** 3.1

## User Story

Koordinator olarak,
Egitime bir veya birden fazla egitmen atamak ve cakisma varsa uyari almak istiyorum,
Boylece cift rezervasyon riski olmadan atama yapabileyim.

## Kabul Kriterleri

**AC1 - Sunucu Tarafli Cakisma Sorgusu**
- `Given` wizard 3. adimda egitmen secimi
- `When` egitmen secersem
- `Then` sistem ayni tarihte planned egitim cakismasini sunucu tarafinda sorgular

**AC2 - Soft Warning**
- `Given` secilen egitmende cakisma var
- `When` atamaya calisirsam
- `Then` cakisan egitim detayiyla warning mesaji gosterilir ve devam secenegi olur

**AC3 - Tek Egitmen Atama**
- `Given` cakisma yok
- `When` kaydedersem
- `Then` egitmen egitime baglanir

**AC4 - Co-trainer Destegi**
- `Given` birden fazla egitmen ekledim
- `When` kaydedersem
- `Then` tumu co-trainer olarak eklenir ve her biri icin cakisma kontrolu yapilir

**AC5 - Warning Stil Kurali**
- `Given` cakisma mesaji
- `When` ekranda gosterildiginde
- `Then` `warning` rengiyle (`#F59E0B`) engelleyici olmayan sekilde gosterilir

## Teknik Kapsam

- `src/components/features/trainings/TrainingWizardStep3.tsx`
- `src/components/features/trainings/ConflictWarning.tsx`
- `src/app/api/trainings/route.ts`
- `src/models/Training.ts`

## Uygulama Gorevleri

1. Atama payload'inda primary + co-trainer alanlarini netlestir.
2. Cakisma kontrolu sorgusunu API katmanina ekle.
3. Soft warning bileşenini wizard adim 3'e entegre et.
4. Atama kaydinda coklu egitmen senaryosunu destekle.

## Test Checklist

- [ ] Cakisma yoksa atama basarili
- [ ] Cakisma varsa warning gosteriliyor
- [ ] Co-trainer atama calisiyor
- [ ] Warning mesaji uygun formatta

## Definition of Done

- Tum kabul kriterleri saglanmis olmali.
- Story 4.4 icin adim 3 ekrani genisletilebilir yapida olmali.
