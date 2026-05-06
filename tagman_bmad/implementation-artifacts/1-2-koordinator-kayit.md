# Story 1.2: Koordinator Kayit

## Metadata
- **Epic:** 1 - Proje Altyapisi & Kimlik Yonetimi
- **Story:** 1.2
- **Status:** ready-for-dev
- **Priority:** High
- **Depends on:** 1.1 - Proje Baslatma & Temel Altyapi

## User Story

Koordinator olarak,
E-posta ve sifreyle sisteme kayit olmak istiyorum,
Boylece portala erismek icin kendi hesabim olsun.

## Kabul Kriterleri

**AC1 - Basarili Kayit:**
- `Given` kayit sayfasi `/register` adresinde
- `When` gecerli e-posta ve sifre (min 8 karakter) ile formu gonderirsem
- `Then` hesap olusturulur, sifre bcrypt ile hash'lenir, JWT httpOnly cookie set edilir ve dashboard'a yonlendirilirim

**AC2 - Duplicate E-posta:**
- `Given` halihazirda kullanilmis bir e-posta ile kayit denemesi
- `When` formu gonderirsem
- `Then` `Bu e-posta adresi zaten kayitli` hata mesaji gorunur

**AC3 - Form Validasyonu:**
- `Given` gecersiz e-posta formati girildiginde
- `When` formu gonderirsem
- `Then` Zod validasyonu alan hatasi gosterir, form gonderilmez

**AC4 - Oturum Baslatma:**
- `Given` basarili kayit sonrasi
- `When` hesap olusturuldugunda
- `Then` JWT token httpOnly cookie olarak set edilir (8 saat sure) ve kullanici kimligi dogrulanmis kabul edilir

## Teknik Kapsam

### Olusturulacak/Guncellenecek Dosyalar

- `src/app/(auth)/register/page.tsx`
- `src/app/api/auth/register/route.ts`
- `src/models/User.ts`
- `src/lib/schemas/auth.schema.ts`
- `src/lib/auth.ts` (gerekli helper'lar zaten varsa yalnizca entegrasyon)
- `src/types/api.types.ts` (gerekirse request/response tipleri)

### Mimari Kurallar (Zorunlu)

- API route envelope formati korunmali:
  - Basari: `{ data: T, error: null }`
  - Hata: `{ data: null, error: { code: string, message: string } }`
- `POST /api/auth/register` public endpoint olmali (`/api/auth/*` middleware disinda).
- Sifreler `bcryptjs` ile hash'lenmeli (salt rounds: 10).
- JWT `httpOnly` cookie olarak set edilmeli (8 saat).
- E-posta alani case-insensitive unique kontrol ile duplicate kaydi engellemeli.

## API Kontrati

### Endpoint
- `POST /api/auth/register`

### Request Body
```json
{
  "email": "koordinator@ornek.com",
  "password": "minimum8karakter"
}
```

### Basarili Response (201)
```json
{
  "data": {
    "user": {
      "id": "<object-id>",
      "email": "koordinator@ornek.com"
    }
  },
  "error": null
}
```

### Hata Response Ornekleri
- `409 CONFLICT` - duplicate e-posta
```json
{
  "data": null,
  "error": {
    "code": "EMAIL_ALREADY_EXISTS",
    "message": "Bu e-posta adresi zaten kayitli"
  }
}
```

- `400 BAD_REQUEST` - validation hatasi
```json
{
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Gecersiz form verisi"
  }
}
```

- `500 INTERNAL_SERVER_ERROR`
```json
{
  "data": null,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Sunucu hatasi"
  }
}
```

## UI/UX Notlari

- Form alanlari: `E-posta`, `Sifre`.
- Label kullanimi zorunlu; placeholder tek basina yeterli degil.
- Zorunlu alanlar gorsel olarak belirtilmeli.
- Form submit sirasinda buton disabled + loading durumu olmali.
- Basarili kayit sonrasi `/dashboard` yerine proje route yapisina gore `/` korumali alanina yonlendirme yapiliyorsa, hedef route net olarak tek bir yerde sabitlenmeli.

## Uygulama Gorevleri

1. Veri modeli
- `User` modeli olustur: `email` (unique, lowercase, trim), `passwordHash`, `createdAt`, `updatedAt`.

2. Schema ve validasyon
- `registerSchema` (Zod):
  - `email`: gecerli e-posta
  - `password`: min 8 karakter

3. Register API
- `POST /api/auth/register` route'unu yaz.
- Validation -> duplicate kontrol -> password hash -> kullanici olusturma -> JWT olusturma -> cookie set -> envelope response.

4. Register sayfasi
- `react-hook-form + zodResolver` ile formu kur.
- Alan hatalarini inline goster.
- API basarisinda korumali alana yonlendir.

5. Hata esleme
- Duplicate e-posta hatasini kullanici dostu mesaja map et.
- Beklenmeyen hatalari genel hata mesaji ile goster.

## Test Checklist

- [ ] Gecerli email + sifre ile kayit basarili (201)
- [ ] Duplicate email ile kayit engelleniyor (409)
- [ ] Gecersiz email validasyon hatasi veriyor
- [ ] 8 karakterden kisa sifre validasyon hatasi veriyor
- [ ] Cookie `httpOnly` ve 8 saat max-age ile set ediliyor
- [ ] Basarili kayit sonrasi yonlendirme dogru
- [ ] API response envelope formati tum path'lerde tutarli

## Definition of Done

- Tum kabul kriterleri saglanmis olmali.
- Route, model, schema ve UI katmanlari birbiriyle tutarli calismali.
- Projede mevcut auth ve error-handling pattern'leri bozulmamali.
- Story durumu `ready-for-dev` olarak sprint-status dosyasina yansitilmis olmali.
