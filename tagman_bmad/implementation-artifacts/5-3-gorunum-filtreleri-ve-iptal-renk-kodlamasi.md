# Story 5.3: Gorunum Filtreleri ve Iptal Renk Kodlamasi

## Metadata
- **Epic:** 5 - Takvim ve Dashboard
- **Story:** 5.3
- **Status:** done
- **Priority:** Medium
- **Depends on:** 5.2

## User Story

Koordinator olarak,
Yalnizca kendi egitimlerim ve tum akademi egitimleri arasinda gecis yapmak ve iptal edilen egitimleri net ayirt etmek istiyorum,
Boylece ilgili veriye odaklanabileyim.

## Kabul Kriterleri

1. `Tum Akademi` filtresi tum koordinator egitimlerini gosterir.
2. `Benim Egitimlerim` filtresi giris yapan koordinatorun kayitlarini gosterir.
3. Cancelled egitimler kirmizi ve belirgin iptal gostergesiyle ayrisir.
4. Filtre secimi oturum seviyesinde hatirlanir.

## Teknik Kapsam

- `src/app/(protected)/dashboard/page.tsx`
- `src/hooks/useDashboard.ts`
- `src/components/features/dashboard/*`

## Uygulama Gorevleri

1. Scope filtresi (`mine/all`) ekle.
2. Dashboard API'ye filtre parametresi bagla.
3. Cancelled gorsel ayrisim kurallarini tum gorunumlere uygula.
4. Filtre secimini session storage veya uygun state ile hatirla.

## Test Checklist

- [ ] Mine/all filtresi dogru calisiyor
- [ ] Cancelled gorunum ayrisimi dogru
- [ ] Filtre secimi geri geliste korunuyor

## Definition of Done

- Tum kabul kriterleri saglanmis olmali.
- Dashboard filtre deneyimi tum gorunumlerde tutarli olmali.
