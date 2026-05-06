# Story 4.3: Egitmen Profil Sayfasi

## Metadata
- **Epic:** 4 - Egitmen Arama, Kesif ve Profil
- **Story:** 4.3
- **Status:** ready-for-dev
- **Priority:** High
- **Depends on:** 3.5, 4.1

## User Story

Koordinator olarak,
Egitmenin profilini read-only gorup gerektiginde edit moduna gecmek istiyorum,
Boylece detayli inceleme ve guncelleme yapabileyim.

## Kabul Kriterleri

1. `/trainers/[id]` sayfasi ad, soyad, kurum durumu, firma, ozgecmis ve skill listesini gosterir.
2. Story 3.5'teki stats endpoint verisiyle ortalama puan widget'i ve yillik bar grafik gorunur.
3. `Duzenle` aksiyonu edit moduna gecirir.
4. Basarili kayit sonrasi read-only moda doner ve yeni veri gosterilir.
5. Pasif egitmende belirgin `Pasif` rozeti gorunur.

## Teknik Kapsam

- `src/app/(protected)/trainers/[id]/page.tsx`
- `src/app/(protected)/trainers/[id]/edit/page.tsx`
- `src/components/features/trainers/TrainerBarChart.tsx`
- `src/hooks/useTrainerStats.ts`

## Uygulama Gorevleri

1. Profil sayfasi veri birlestirmesini (trainer + stats) uygula.
2. Ortalama puan widget'ini 1 ondalik formatla goster.
3. Yillik egitim bar grafik bileşenini bagla.
4. Edit/read-only gecis akislarini finalize et.

## Test Checklist

- [ ] Profil alanlari dogru geliyor
- [ ] Stats verisi dogru gosteriliyor
- [ ] Edit/save/read-only akisi calisiyor
- [ ] Pasif rozet gorunuyor

## Definition of Done

- Tum kabul kriterleri saglanmis olmali.
- Profil sayfasi performans ve veri tutarliligi hedeflerini karsilamali.
