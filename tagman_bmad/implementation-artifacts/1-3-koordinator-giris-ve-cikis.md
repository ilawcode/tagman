# Story 1.3: Koordinator Giris ve Cikis

## Metadata
- **Epic:** 1 - Proje Altyapisi ve Kimlik Yonetimi
- **Story:** 1.3
- **Status:** ready-for-dev
- **Priority:** High
- **Depends on:** 1.1, 1.2

## User Story

Koordinator olarak,
E-posta ve sifreyle giris yapip isim bittiginde cikis yapabilmek istiyorum,
Boylece oturumum guvenli olsun.

## Kabul Kriterleri

**AC1 - Basarili Giris**
- `Given` giris sayfasi `/login` adresinde
- `When` gecerli kimlik bilgileriyle formu gonderirsem
- `Then` JWT httpOnly cookie set edilir ve dashboard'a yonlendirilirim

**AC2 - Hatali Kimlik Bilgisi**
- `Given` yanlis sifre veya var olmayan e-posta
- `When` giris denersem
- `Then` `E-posta veya sifre hatali` mesaji gorunur; hangisinin yanlis oldugu belirtilmez

**AC3 - Cikis**
- `Given` giris yapmis durumdayim
- `When` cikis yaparim
- `Then` JWT cookie temizlenir ve `/login` sayfasina yonlendirilirim

**AC4 - Korumali Rotaya Erisim**
- `Given` giris yapmamis durumdayim
- `When` herhangi bir korumali rotaya erismeye calistigimda
- `Then` `/login` sayfasina yonlendirilirim

## Teknik Kapsam

- `src/app/(auth)/login/page.tsx`
- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/logout/route.ts`
- `src/lib/auth.ts`
- `src/middleware.ts`

## Uygulama Gorevleri

1. Login API route olustur (`POST /api/auth/login`).
2. Email/sifre kontrolu yap, bcrypt ile verify et.
3. Basarili login'de JWT olustur ve httpOnly cookie set et.
4. Logout API route ile cookie temizleme akisini tamamla.
5. Login sayfasi formunu RHF + Zod ile uygula.
6. Korumali rota davranislarini middleware ve layout ile dogrula.

## Test Checklist

- [ ] Basarili login cookie set ediyor
- [ ] Hatali login dogru hata mesaji donduruyor
- [ ] Logout cookie'yi siliyor
- [ ] Korumali route giris yoksa login'e yonlendiriyor

## Definition of Done

- Tum kabul kriterleri saglanmis olmali.
- API envelope formati korunmus olmali.
- Auth akisinda guvenlik kurallari (httpOnly, 8 saat) korunmus olmali.
