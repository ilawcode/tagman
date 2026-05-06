# Story 2.2: Egitmen Olusturma

## Metadata
- **Epic:** 2 - Egitmen ve Skill Yonetimi
- **Story:** 2.2
- **Status:** ready-for-dev
- **Priority:** High
- **Depends on:** 1.1, 2.1

## User Story

Koordinator olarak,
Yeni bir egitmen profili temel bilgilerle olusturmak istiyorum,
Boylece egitmen sisteme dahil olsun.

## Kabul Kriterleri

**AC1 - Egitmen Kaydi**
- `Given` `/trainers/new` formu
- `When` ad, soyad, kurum ici/disi ve ozgecmisi doldurup kaydedersem
- `Then` egitmen `isActive: true` ile olusur ve profil sayfasina yonlendirilirim

**AC2 - Kurum Disi Alani**
- `Given` `Kurum Disi` secildiginde
- `When` form render edildiginde
- `Then` danismanlik firmasi alani gorunur ve zorunlu olur

**AC3 - Kurum Ici Alani**
- `Given` `Kurum Ici` secildiginde
- `When` form render edildiginde
- `Then` danismanlik firmasi alani gizlenir

**AC4 - Zorunlu Alan Validasyonu**
- `Given` ad/soyad eksik
- `When` formu gonderirsem
- `Then` Zod alan hatasi gosterir ve gonderim olmaz

## Teknik Kapsam

- `src/app/(protected)/trainers/new/page.tsx`
- `src/app/api/trainers/route.ts`
- `src/models/Trainer.ts`
- `src/lib/schemas/trainer.schema.ts`

## Uygulama Gorevleri

1. Trainer modeli ve schema alanlarini tanimla.
2. Create trainer API route'unu yaz.
3. Formu RHF + Zod ile uygula.
4. Kurum ici/disi kosullu alan davranisini ekle.
5. Basarili kayit sonrasi profile yonlendirmeyi tamamla.

## Test Checklist

- [ ] Egitmen olusturma basarili
- [ ] Kurum disi seciminde firma alani zorunlu
- [ ] Kurum ici seciminde firma alani gizli
- [ ] Ad/soyad validasyonu calisiyor

## Definition of Done

- Tum kabul kriterleri saglanmis olmali.
- Form davranislari UX kurallariyla uyumlu olmali.
