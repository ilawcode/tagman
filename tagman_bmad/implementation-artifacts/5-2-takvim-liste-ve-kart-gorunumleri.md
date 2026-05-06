# Story 5.2: Takvim Liste ve Kart Gorunumleri

## Metadata
- **Epic:** 5 - Takvim ve Dashboard
- **Story:** 5.2
- **Status:** done
- **Priority:** Medium
- **Depends on:** 5.1

## User Story

Koordinator olarak,
Egitimleri takvim, liste ve kart gorunumleri arasinda gecisle izlemek istiyorum,
Boylece farkli takip ihtiyaclarina hizli uyum saglayayim.

## Kabul Kriterleri

1. Takvim gorunumu aylik izgara olarak egitimleri gosterir.
2. Liste gorunumu kronolojik satirlar halinde gosterir.
3. Kart gorunumu temel bilgi kartlariyla gosterir.
4. Gorunum gecisi tam sayfa yenileme olmadan olur.
5. Durum badge renkleri: planned mavi, completed yesil, cancelled kirmizi.

## Teknik Kapsam

- `src/components/features/dashboard/CalendarView.tsx`
- `src/components/features/dashboard/MonthView.tsx`
- `src/components/features/dashboard/ListView.tsx`
- `src/components/features/dashboard/CardView.tsx`
- `src/app/(protected)/dashboard/page.tsx`

## Uygulama Gorevleri

1. Gorunum switcher state'ini kur.
2. Uc gorunum bileşenini bagla.
3. Durum badge renk map'ini ortak util olarak cikar.
4. SPA gecis performansini dogrula.

## Test Checklist

- [ ] Takvim/liste/kart gorunumleri calisiyor
- [ ] Gecislerde full reload yok
- [ ] Durum renkleri dogru

## Definition of Done

- Tum kabul kriterleri saglanmis olmali.
- Gorunumler arasi veri tutarliligi korunmus olmali.
