# Story 2.3: Egitmene Skill Atama

## Metadata
- **Epic:** 2 - Egitmen ve Skill Yonetimi
- **Story:** 2.3
- **Status:** ready-for-dev
- **Priority:** High
- **Depends on:** 2.1, 2.2

## User Story

Koordinator olarak,
Bir egitmene katalogdan skill atamak ve 10 uzerinden puan girmek istiyorum,
Boylece egitmenin yetkinlik profili dogru tutulabilsin.

## Kabul Kriterleri

**AC1 - Skill Atama**
- `Given` `/trainers/[id]/edit` ekraninda
- `When` skill secip puan girersem
- `Then` skill egitmen profiline eklenir

**AC2 - Skill Puani Guncelleme**
- `Given` atanmis bir skill
- `When` puani guncellersem
- `Then` yeni puan eskisinin yerini alir

**AC3 - Skill Kaldirma**
- `Given` atanmis bir skill
- `When` kaldirirsam
- `Then` skill egitmen profilinden silinir

**AC4 - Puan Araligi**
- `Given` 1-10 disinda puan
- `When` kaydetmeye calisirsam
- `Then` Zod alan hatasi gosterilir

**AC5 - Sadece Aktif Skill'ler**
- `Given` aktif/pasif skill'ler var
- `When` atama dropdown'u acilir
- `Then` yalnizca aktif skill'ler listelenir

## Teknik Kapsam

- `src/app/(protected)/trainers/[id]/edit/page.tsx`
- `src/app/api/trainers/[id]/route.ts`
- `src/models/Trainer.ts`
- `src/models/Skill.ts`
- `src/lib/schemas/trainer.schema.ts`

## Uygulama Gorevleri

1. Trainer modelinde skills alt dokumani yapisini netlestir.
2. Skill ekleme/guncelleme/silme API akislarini yaz.
3. UI'da skill chips + puan guncelleme davranisini uygula.
4. Dropdown source'unu aktif skill listesiyle sinirla.

## Test Checklist

- [ ] Skill ekleme calisiyor
- [ ] Skill puani guncelleniyor
- [ ] Skill kaldirma calisiyor
- [ ] Puan validasyonu dogru
- [ ] Pasif skill dropdown'da yok

## Definition of Done

- Tum kabul kriterleri saglanmis olmali.
- Egitmen skill verisi tutarli kalmali.
