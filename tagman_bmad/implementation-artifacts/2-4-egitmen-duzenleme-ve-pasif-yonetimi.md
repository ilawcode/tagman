# Story 2.4: Egitmen Duzenleme ve Pasif Yonetimi

## Metadata
- **Epic:** 2 - Egitmen ve Skill Yonetimi
- **Story:** 2.4
- **Status:** ready-for-dev
- **Priority:** Medium
- **Depends on:** 2.2, 2.3

## User Story

Koordinator olarak,
Mevcut bir egitmen profilini duzenlemek ve aktif/pasif durumunu kontrol etmek istiyorum,
Boylece bilgiler guncel kalsin ve pasif egitmenler yeni atamalarda gorunmesin.

## Kabul Kriterleri

**AC1 - Profil Duzenleme**
- `Given` `/trainers/[id]/edit` formu
- `When` alanlari guncelleyip kaydedersem
- `Then` degisiklikler kalici saklanir

**AC2 - Pasife Alma**
- `Given` aktif bir egitmen
- `When` pasife alirsam
- `Then` `isActive: false` olur; arama ve atama listelerinde gorunmez

**AC3 - Yeniden Aktive Etme**
- `Given` pasif bir egitmen
- `When` yeniden aktive edersem
- `Then` `isActive: true` olur ve tekrar listelenir

**AC4 - Pasif Rozeti**
- `Given` pasif bir egitmen
- `When` profilini goruntulersem
- `Then` belirgin `Pasif` rozeti gorunur

## Teknik Kapsam

- `src/app/(protected)/trainers/[id]/edit/page.tsx`
- `src/app/(protected)/trainers/[id]/page.tsx`
- `src/app/api/trainers/[id]/route.ts`
- `src/models/Trainer.ts`

## Uygulama Gorevleri

1. Trainer update API ve soft delete/activate akislarini tamamla.
2. Edit UI kaydetme deneyimini finalize et.
3. Profil sayfasina pasif rozetini ekle.
4. Arama/atama sorgularinda `isActive: true` filtresini zorunlu tut.

## Test Checklist

- [ ] Profil alanlari guncelleniyor
- [ ] Pasife alma aramada etkili
- [ ] Re-activate aramada geri getiriyor
- [ ] Pasif rozet gorunuyor

## Definition of Done

- Tum kabul kriterleri saglanmis olmali.
- Soft delete tutarliligi tum ilgili sorgulara yansimis olmali.
