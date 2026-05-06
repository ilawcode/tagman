# Story 5.1: Dashboard ve Haftalik Ozet

## Metadata
- **Epic:** 5 - Takvim ve Dashboard
- **Story:** 5.1
- **Status:** done
- **Priority:** High
- **Depends on:** 3.1

## User Story

Koordinator olarak,
Dashboard acildiginda bu haftaki ve yaklasan egitimlerin ozetini gormek istiyorum,
Boylece anlik genel bakis elde edebileyim.

## Kabul Kriterleri

1. `/dashboard` acildiginda mevcut haftanin egitimleri vurgulu gorunur.
2. Sonraki 30 gun egitimleri konu, tarih ve durumla listelenir.
3. Bu hafta egitim yoksa bos durum mesaji gosterilir.

## Teknik Kapsam

- `src/app/(protected)/dashboard/page.tsx`
- `src/app/api/dashboard/route.ts`
- `src/hooks/useDashboard.ts`

## Uygulama Gorevleri

1. Dashboard API ozet query'sini yaz.
2. Haftalik ve 30 gunluk bloklari UI'da ayir.
3. Bos durum ve loading durumlarini tasarla.

## Test Checklist

- [ ] Haftalik ozet dogru geliyor
- [ ] 30 gun listesi dogru
- [ ] Bos durum calisiyor

## Definition of Done

- Tum kabul kriterleri saglanmis olmali.
- Dashboard veri akisi kararlı olmali.
