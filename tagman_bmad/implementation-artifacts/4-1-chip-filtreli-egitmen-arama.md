# Story 4.1: Chip Filtreli Egitmen Arama

## Metadata
- **Epic:** 4 - Egitmen Arama, Kesif ve Profil
- **Story:** 4.1
- **Status:** ready-for-dev
- **Priority:** High
- **Depends on:** 2.4, 3.5

## User Story

Koordinator olarak,
Ad/soyad, kurum ici/disi, danismanlik firmasi, skill ve minimum puan chip filtreleriyle egitmen aramak istiyorum,
Boylece ihtiyacim olan egitmeni hizlica bulabileyim.

## Kabul Kriterleri

1. Ad/soyad aramasi aktif egitmenleri getirir.
2. Skill chip'i secildiginde sadece ilgili skill'e sahip egitmenler listelenir.
3. Minimum puan chip'i esik altindakileri filtreler.
4. Birden fazla chip AND mantigiyla uygulanir.
5. Chip kaldirilinca sonuc aninda guncellenir.
6. Sonuclarda ad, soyad, kurum durumu ve ortalama puan gorunur.
7. Ikincil gorunumde skill listesi acilabilir.
8. Sonuc yoksa bos durum mesaji + filtre temizleme aksiyonu gorunur.

## Teknik Kapsam

- `src/app/(protected)/search/page.tsx`
- `src/components/features/search/SearchFilters.tsx`
- `src/app/api/trainers/search/route.ts`
- `src/models/Trainer.ts`

## Uygulama Gorevleri

1. Filtre state modelini chip bazli kur.
2. Search API'de and-combine filtre sorgusunu uygula.
3. Sonuc kartinda tek bakista karar alanlarini goster.
4. Bos durum davranisini ekle.

## Test Checklist

- [ ] Tum filtre tipleri calisiyor
- [ ] AND mantigi dogru
- [ ] Sonuc karti alanlari dogru
- [ ] Bos durum gorunuyor

## Definition of Done

- Tum kabul kriterleri saglanmis olmali.
- Filtre degisikligi tam sayfa yenilemesi olmadan calismali.
