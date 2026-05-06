# Story 2.1: Skill Katalogu Yonetimi

## Metadata
- **Epic:** 2 - Egitmen ve Skill Yonetimi
- **Story:** 2.1
- **Status:** ready-for-dev
- **Priority:** High
- **Depends on:** 1.1

## User Story

Koordinator olarak,
Merkezi skill kataloguna yeni skill eklemek ve kullanilmayan skill'leri pasife almak istiyorum,
Boylece skill atamalari kontrollu bir listeden yapilsin.

## Kabul Kriterleri

**AC1 - Skill Ekleme**
- `Given` `/skills` sayfasinda
- `When` yeni bir skill adi girip kaydedersem
- `Then` skill `createdAt` ve `isActive: true` ile eklenir

**AC2 - Skill Pasife Alma**
- `Given` aktif bir skill
- `When` pasife alirsam
- `Then` `isActive: false` olur ve yeni atama dropdown'larinda gorunmez

**AC3 - Gecmis Kayitlari Koruma**
- `Given` pasife alinmis bir skill
- `When` atandigi egitmen profiline bakarsam
- `Then` mevcut atama gorunmeye devam eder

**AC4 - Liste Bilgileri**
- `Given` skills sayfasi yuklendigininde
- `When` listeye bakarsam
- `Then` her skill icin ad ve eklenme tarihi gorulur

**AC5 - Duplicate Skill Engeli**
- `Given` ayni isimde aktif skill zaten varsa
- `When` yeni skill kaydedilmeye calisilinca
- `Then` `Bu skill adi zaten mevcut` mesaji gosterilir, kayit yapilmaz

## Teknik Kapsam

- `src/app/(protected)/skills/page.tsx`
- `src/app/api/skills/route.ts`
- `src/app/api/skills/[id]/route.ts`
- `src/models/Skill.ts`
- `src/lib/schemas/skill.schema.ts`

## Uygulama Gorevleri

1. Skill modeli olustur (`name`, `isActive`, `createdAt`, `updatedAt`).
2. Case-insensitive unique ad kontrolu ekle.
3. Skills API (`GET`, `POST`) ve tekil guncelleme/pasiflestirme route'larini yaz.
4. Skills sayfasinda create/list/pasife alma UI akislarini tamamla.
5. Atama dropdown sorgularinda sadece `isActive: true` skill'leri dondur.

## Test Checklist

- [ ] Yeni skill olusuyor
- [ ] Duplicate skill engelleniyor
- [ ] Soft delete sonrasi yeni atamada gorunmuyor
- [ ] Gecmis atama kayitlari bozulmuyor

## Definition of Done

- Tum kabul kriterleri saglanmis olmali.
- Soft delete davranisi veri butunlugunu korumali.
