---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
lastStep: 8
status: 'complete'
completedAt: '2026-05-06'
inputDocuments: [prd.md]
workflowType: 'architecture'
project_name: 'tagman'
user_name: 'ugerdem'
date: '2026-05-06'
---

# Architecture Decision Document

_Bu doküman her mimari karar adımında birlikte genişletilmektedir._

## Project Context Analysis

### Requirements Overview

**Fonksiyonel Gereksinimler:**

| Kapasite Alanı | FR Sayısı | Mimari Ağırlık |
|----------------|-----------|----------------|
| Kimlik Yönetimi | 3 | Düşük — standart JWT auth |
| Eğitmen Yönetimi | 6 | Orta — CRUD + soft delete pattern |
| Skill Kataloğu | 7 | Orta — merkezi katalog, tarih takibi |
| Eğitim Yönetimi | 9 | Yüksek — wizard akışı, çakışma kontrolü, durum makinesi |
| Eğitmen Arama & Keşif | 8 | Yüksek — çok kriterli filtreleme, önerilen eğitmenler, CSV export |
| Takvim & Dashboard | 6 | Orta — 3 görünüm modu, veri aggregation |
| Değerlendirme & Puanlama | 4 | Orta — otomatik hesaplama, bar grafik |

**Non-Functional Gereksinimler:**
- Arama sorgusu < 1 sn → MongoDB index tasarımı kritik
- Önerilen Eğitmenler sorgusu < 1.5 sn → aggregation pipeline optimizasyonu
- Profil sayfası < 2 sn → hesaplanan verilerin pre-aggregation stratejisi
- SPA geçişleri < 300ms → Next.js App Router + client-side state yönetimi
- JWT auth, bcrypt, HTTPS, korumalı API rotaları

**Ölçek & Karmaşıklık:**
- **Birincil domain:** Full-stack web (Next.js frontend + API Routes + MongoDB)
- **Karmaşıklık:** Orta
- **Tenant yapısı:** Single-tenant
- **Gerçek zamanlılık:** Yok
- **Dış entegrasyon:** Yok

### Teknik Kısıtlar ve Bağımlılıklar

- Next.js App Router — SPA davranışı; server/client component ayrımı gerektirir
- MongoDB — soft delete, çakışma kontrolü ve aggregation tasarımı baştan netleşmeli
- JWT — token yenileme ve geçersiz kılma stratejisi belirlenecek
- Yalnızca masaüstü tarayıcı — responsive breakpoint yükü minimal

### Çapraz Kesen Endişeler

1. **Authentication middleware** — tüm API rotaları JWT doğrulaması; Next.js middleware ile merkezi yönetim
2. **Soft delete pattern** — `isActive` flag; tüm sorgular pasif kayıtları otomatik filtreler
3. **MongoDB aggregation** — arama, önerilen eğitmenler, ortalama puan, bar grafik; index tasarımı ve pipeline optimizasyonu
4. **Çakışma kontrolü** — atama öncesi sunucu tarafı doluluk sorgusu; iptal bloğu kaldırır
5. **Otomatik puan hesabı** — eğitim tamamlandığında eğitmenin ortalaması güncellenir
6. **Eğitim durum makinesi** — Planlandı → Tamamlandı / İptal; her geçişin kuralları var

## Starter Template Değerlendirmesi

### Birincil Teknoloji Alanı

Full-stack web uygulaması (Next.js frontend + API Routes + MongoDB backend)

### Değerlendirilen Starter Seçenekleri

| Starter | Artı | Eksi |
|---------|------|------|
| `create-next-app@latest` | Resmi, App Router, TypeScript+Tailwind dahil, aktif bakım | MongoDB/JWT manuel kurulum |
| MongoDB Atlas Starter | MongoDB entegrasyonu hazır | Pages Router ağırlıklı, belirsiz bakım |
| Üçüncü parti boilerplate'ler | Hızlı başlangıç | Opinionated, bakım kalitesi değişken |

### Seçilen Starter: `create-next-app@latest`

**Seçim Gerekçesi:** Resmi ve en aktif bakımlı seçenek. App Router desteği, TypeScript ve Tailwind hazır yapılandırması, authentication middleware entegrasyonu ve AI coding agent uyumluluğu (AGENTS.md) proje gereksinimlerine tam uyum sağlıyor.

**Başlatma Komutu:**

```bash
npx create-next-app@latest tagman \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --turbopack \
  --src-dir \
  --import-alias "@/*"
```

**Starter'ın Sağladığı Mimari Kararlar:**

**Dil & Runtime:** TypeScript (strict mode), Node.js 20+

**Stil Çözümü:** Tailwind CSS v4 — utility-first, masaüstü odaklı proje için ideal

**Build Araçları:** Turbopack (dev), Next.js built-in bundler (prod)

**Test Framework:** Starter dahil değil — Jest + React Testing Library ayrıca kurulacak

**Kod Organizasyonu:** `src/` dizini, App Router convention'ları (`app/`, `components/`, `lib/`)

**Geliştirme Deneyimi:** Hot reload, TypeScript type checking, ESLint, Turbopack hız optimizasyonu

**Manuel Eklenecek Paketler:**
- `mongoose` — MongoDB ODM
- `jsonwebtoken` + `@types/jsonwebtoken` — JWT
- `bcryptjs` + `@types/bcryptjs` — şifre hash
- Next.js middleware — kimlik doğrulama
- `@tanstack/react-query` + `@tanstack/react-query-devtools` — server state
- `react-hook-form` + `@hookform/resolvers` — form yönetimi
- `zod` — validasyon (hem client hem server)
- `recharts` — bar grafik (profil sayfası yıllık eğitim sayısı)

**UI Bileşen Kütüphanesi:** `shadcn/ui`
- Kurulum: `npx shadcn-ui@latest init` (Epic 1 Story 1.1'de yapılır)
- Kullanılacak bileşenler: Button, Input, Select, Textarea, Dialog, Badge, Popover, Separator
- `src/components/ui/` — shadcn/ui tarafından yönetilen bileşenler (manuel düzenleme önerilmez)
- Tailwind CSS v4 zaten starter ile geliyor; shadcn/ui bu konfigürasyonun üzerine kurulur

**Tailwind Design Tokens (tailwind.config.ts):**
```typescript
// Turkcell Kurumsal Marka Renkleri
theme: {
  extend: {
    colors: {
      primary: '#FFD100',        // CTA butonları, aktif chip, sidebar aktif gösterge
      'primary-foreground': '#1A1A1A',
      background: '#F5F5F5',     // Sayfa arka planı
      surface: '#FFFFFF',        // Kart, panel, modal
      'sidebar-bg': '#1A1A1A',   // Sol navigasyon
      'sidebar-text': '#FFFFFF',
      'sidebar-active': '#FFD100',
      success: '#22C55E',        // Tamamlandı durumu
      warning: '#F59E0B',        // Çakışma soft warning
      destructive: '#EF4444',    // İptal durumu, hata
    }
  }
}
```

**Not:** Projenin ilk implementation story'si bu komutu çalıştırmak, shadcn/ui kurmak ve temel klasör yapısını oluşturmak olmalıdır.

## Temel Mimari Kararlar

### Karar Öncelik Analizi

**Kritik Kararlar (Implementasyonu Bloklar):**
- JWT httpOnly cookie — tüm auth akışını şekillendirir
- Mongoose ODM — tüm veri erişim katmanını belirler
- React Query — server state yönetimi mimarisini belirler

**Önemli Kararlar (Mimariyi Şekillendirir):**
- Zod + Mongoose çift validasyon katmanı
- React Hook Form — wizard akışı için
- Standart API response envelope

**Ertelenen Kararlar (Post-MVP):**
- Monitoring: Sentry — başlangıçta Vercel built-in yeterli
- Caching: Redis — şu an için React Query cache yeterli

### Veri Mimarisi

| Karar | Seçim | Gerekçe |
|-------|-------|---------|
| MongoDB ODM | **Mongoose** | Schema validation, populate, middleware hook — soft delete ve aggregation için kritik |
| Veri Validasyonu | **Zod** (API boundary) + **Mongoose schema** | Zod: client/server tip güvenliği; Mongoose: DB katmanı doğrulaması |
| Caching | **React Query client cache** | Server state için yeterli; Redis gereksiz karmaşıklık ekler |
| Migration | Schema versiyonlama yok — Mongoose schema değişiklikleri yeterli | Single-tenant, controlled rollout |

### Authentication & Security

| Karar | Seçim | Gerekçe |
|-------|-------|---------|
| JWT depolama | **httpOnly Cookie** | XSS koruması; iç uygulama olsa da güvenli default |
| Token süresi | **8 saat, refresh token yok** | İş günü = yeterli; sayfa yenilenince çıkış (PRD onayı) |
| Auth middleware | **Next.js `middleware.ts`** — merkezi | Her route'da ayrı guard yerine tek nokta |
| Şifre hash | **bcryptjs**, salt rounds: 10 | Standart güvenli değer |
| API koruması | JWT doğrulaması tüm `/api/*` route'larında | Sadece `/api/auth/*` public |

### API & İletişim Desenleri

| Karar | Seçim | Gerekçe |
|-------|-------|---------|
| API tipi | **REST** — Next.js App Router API Routes | Starter ile uyumlu, gereksiz karmaşıklık yok |
| Response format | **Standart envelope** | Tutarlı hata yönetimi için |
| Error handling | **Merkezi `apiHandler` wrapper** | Her route'da tekrarlayan try/catch yerine |

```typescript
// Standart API response envelope
{ data: T; error: null } | { data: null; error: { code: string; message: string } }
```

### Frontend Mimarisi

| Karar | Seçim | Gerekçe |
|-------|-------|---------|
| Server state | **React Query (TanStack Query)** | Fetch, cache, refetch — tüm API data buradan |
| Client state | **React Context** (yalnızca auth) | Zustand gereksiz; global state minimal |
| Form yönetimi | **React Hook Form** | Wizard akışı ve validasyon için standart |
| Routing | **Next.js App Router** — starter kararı | `app/` dizini convention'ları |
| UI Bileşenleri | **shadcn/ui** + Tailwind CSS | Next.js App Router ile tam uyumlu; kopyala-yapıştır mimarisi; Turkcell sarısı tek token ile uygulanır; Linear görsel diline en yakın sonucu verir |
| Tipografi | **Inter** (next/font/google) | UX spec kararı; sistem fontu fallback ile |
| Grafik | **Recharts** | Bar grafik (yıllık eğitim sayısı); Next.js uyumlu, hafif |

### Infrastructure & Deployment

| Karar | Seçim | Gerekçe |
|-------|-------|---------|
| Hosting | **Vercel** | Next.js için optimize, sıfır config, iç araç için yeterli |
| DB hosting | **MongoDB Atlas** (Free Tier → M10 gerekirse) | Managed, yedekleme dahil |
| Environment config | `.env.local` / Vercel environment variables | Standart Next.js yaklaşımı |
| Logging | Vercel built-in + `console.error` | MVP için yeterli; prod'da Sentry eklenebilir |

### Karar Etki Analizi

**Implementation Sırası:**
1. Mongoose bağlantısı ve temel schema'lar
2. JWT middleware ve auth API route'ları
3. React Query provider kurulumu
4. Domain feature'ları (trainer, skill, training, evaluation)

**Çapraz Bileşen Bağımlılıkları:**
- Zod schema'ları hem frontend validasyon hem API boundary'de paylaşılır (`src/lib/schemas/`)
- React Query cache invalidation — eğitim tamamlandığında trainer score otomatik güncellenir
- Mongoose middleware — `isActive: false` set eden soft delete hook'u tüm modellerde ortak

## Implementation Patterns & Tutarlılık Kuralları

### Tespit Edilen Potansiyel Çakışma Noktaları: 6 Alan

### Naming Patterns

**MongoDB Collection & Mongoose Model:**
```typescript
// Mongoose model: PascalCase, tekil
const Trainer = mongoose.model('Trainer', trainerSchema)
// MongoDB collection (otomatik): trainers — lowercase, çoğul

// Alan adları: camelCase
{ firstName, lastName, isActive, createdAt, consultingFirm }
// ❌ Yasak: first_name, is_active, created_at
```

**API Endpoint Adlandırma:**
```
GET  /api/trainers              ✅ lowercase, çoğul, kebab-case
GET  /api/trainers/:id
POST /api/trainers
GET  /api/skill-catalog          ✅ çok kelime: kebab-case
GET  /api/trainings/:id/assignments

❌ Yasak: /api/getTrainers, /api/Trainers, /api/trainer_list
```

**TypeScript Interface/Type:**
```typescript
interface Trainer { ... }              // PascalCase, "I" prefix yok
interface TrainingAssignment { ... }
interface CreateTrainerRequest { ... } // DTO'lar için Action+Entity+Request/Response
interface TrainerListResponse { ... }
// ❌ Yasak: ITrainer, trainer_interface
```

**Dosya & Klasör Adlandırma:**
```
src/components/TrainerCard.tsx       // React bileşen: PascalCase
src/components/SkillBadge.tsx
src/lib/trainerService.ts            // Utility/service: camelCase
src/hooks/useTrainers.ts             // Hook: use prefix + camelCase
src/models/Trainer.ts                // Mongoose model: PascalCase
```

### Structure Patterns

**Klasör Organizasyonu:**
```
src/
├── app/
│   ├── api/                    # API Routes
│   │   ├── auth/               # Public: login, register
│   │   ├── trainers/
│   │   ├── skills/
│   │   ├── trainings/
│   │   └── evaluations/
│   ├── (protected)/            # Auth gerektiren sayfalar
│   │   ├── trainers/
│   │   ├── trainings/
│   │   └── dashboard/
│   └── (auth)/                 # Login/register sayfaları
├── components/
│   ├── ui/                     # Tekrar kullanılabilir UI bileşenleri
│   └── features/               # Feature-specific bileşenler
│       ├── trainers/
│       ├── trainings/
│       └── evaluations/
├── lib/
│   ├── db.ts                   # MongoDB bağlantısı (singleton)
│   ├── auth.ts                 # JWT helper'ları
│   ├── apiHandler.ts           # Merkezi API wrapper
│   └── schemas/                # Paylaşılan Zod schema'ları
├── models/                     # Mongoose modelleri
└── hooks/                      # React Query hook'ları
```

**Test Dosyaları:** Co-located `*.test.ts` — örn. `src/lib/trainerService.test.ts`

### Format Patterns

**API Response Envelope — Tüm Route'larda Zorunlu:**
```typescript
// Başarı
{ data: T, error: null }

// Hata
{ data: null, error: { code: string, message: string } }

// Örnekler
{ data: { trainers: [...], total: 42 }, error: null }
{ data: null, error: { code: "TRAINER_NOT_FOUND", message: "Eğitmen bulunamadı" } }
```

**Diğer Format Kuralları:**
- Tarih: ISO 8601 string (`"2026-05-06T09:00:00.000Z"`) — timestamp/number yasak
- JSON alan adları: camelCase — MongoDB dokümanlarda ve API response'larda aynı
- Boolean: `true`/`false` — `1`/`0` yasak

### Process Patterns

**Soft Delete — Her Sorguda Zorunlu:**
```typescript
// ✅ Her zaman isActive filtresi
Trainer.find({ isActive: true, ...filters })

// Soft delete işlemi
await Trainer.findByIdAndUpdate(id, { isActive: false })

// ❌ Fiziksel silme kesinlikle yasak
await Trainer.findByIdAndDelete(id)   // ASLA KULLANMA
```

**API Handler Wrapper:**
```typescript
// src/lib/apiHandler.ts — Her route bu wrapper'ı kullanır
export function apiHandler(handler: NextApiHandler) {
  return async (req, res) => {
    try {
      await handler(req, res)
    } catch (error) {
      return res.status(500).json({
        data: null,
        error: { code: 'INTERNAL_ERROR', message: 'Sunucu hatası' }
      })
    }
  }
}
```

**React Query Key Conventions:**
```typescript
['trainers']                      // liste
['trainers', id]                  // tekil
['trainers', 'search', params]    // arama/filtreleme
['trainings', id, 'assignments']  // nested resource
```

**Form Validasyon Akışı:**
Zod schema → React Hook Form `zodResolver` → submit → API Zod parse → Mongoose save

### Zorunlu Kurallar (Tüm AI Agent'lar İçin)

1. **Soft delete:** Her sorguda `{ isActive: true }` filtresi — istisnasız
2. **API response:** Her zaman `{ data, error }` envelope yapısı
3. **Tarih:** ISO 8601 string — asla timestamp/Date objesi JSON'da
4. **Fiziksel silme:** Asla `findByIdAndDelete` — her zaman `{ isActive: false }` update
5. **Auth:** Her protected `/api/*` route'da JWT doğrulaması — `middleware.ts` veya `apiHandler`
6. **Alan adları:** camelCase — DB'de, API'de, TypeScript'te tutarlı

### Anti-Pattern Örnekleri

```typescript
// ❌ Fiziksel silme
await Trainer.findByIdAndDelete(id)

// ✅ Soft delete
await Trainer.findByIdAndUpdate(id, { isActive: false })

// ❌ isActive filtresi eksik
const trainers = await Trainer.find({ skill: skillId })

// ✅ Her zaman isActive filtresi
const trainers = await Trainer.find({ skill: skillId, isActive: true })

// ❌ Ham response
res.json({ trainers: [...] })

// ✅ Envelope
res.json({ data: { trainers: [...] }, error: null })
```

## Proje Yapısı & Sınırlar

### FR Kategorilerinin Mimari Bileşenlere Eşlemesi

| FR Kategorisi | Dizin / Modül |
|---------------|---------------|
| Kimlik Yönetimi (FR1-3) | `app/(auth)/`, `app/api/auth/`, `models/User.ts` |
| Eğitmen Yönetimi (FR4-9) | `app/(protected)/trainers/`, `app/api/trainers/`, `models/Trainer.ts` |
| Skill Kataloğu (FR10-16) | `app/(protected)/skills/`, `app/api/skills/`, `models/Skill.ts` |
| Eğitim Yönetimi (FR17-25) | `app/(protected)/trainings/`, `app/api/trainings/`, `models/Training.ts` |
| Eğitmen Arama & Keşif (FR26-33) | `app/(protected)/search/`, `app/api/trainers/search/` |
| Takvim & Dashboard (FR34-39) | `app/(protected)/dashboard/`, `app/api/dashboard/` |
| Değerlendirme & Puanlama (FR40-43) | `app/api/evaluations/`, `models/Evaluation.ts` |

### Tam Proje Dizin Yapısı

```
tagman/
├── .env.local                         # Environment variables (git'e girmiyor)
├── .env.example                       # Environment template
├── .gitignore
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── eslint.config.mjs
├── package.json
│
└── src/
    ├── middleware.ts                  # JWT doğrulama — tüm korumalı route'lar
    │
    ├── app/
    │   ├── layout.tsx                 # Root layout — QueryClientProvider, AuthProvider
    │   ├── globals.css
    │   │
    │   ├── (auth)/                    # Public sayfalar (JWT gerekmez)
    │   │   ├── login/
    │   │   │   └── page.tsx
    │   │   └── register/
    │   │       └── page.tsx
    │   │
    │   ├── (protected)/               # Auth gerektiren sayfalar
    │   │   ├── layout.tsx             # Auth guard + ortak layout
    │   │   ├── dashboard/
    │   │   │   └── page.tsx           # Takvim (3 görünüm) + yaklaşan eğitimler
    │   │   ├── trainers/
    │   │   │   ├── page.tsx           # Eğitmen listesi
    │   │   │   ├── new/
    │   │   │   │   └── page.tsx       # Eğitmen ekleme formu
    │   │   │   └── [id]/
    │   │   │       ├── page.tsx       # Eğitmen profili (read-only)
    │   │   │       └── edit/
    │   │   │           └── page.tsx   # Eğitmen düzenleme
    │   │   ├── skills/
    │   │   │   └── page.tsx           # Skill kataloğu yönetimi
    │   │   ├── trainings/
    │   │   │   ├── page.tsx           # Eğitim listesi
    │   │   │   └── new/
    │   │   │       └── page.tsx       # Eğitim ekleme wizard (3 adım)
    │   │   └── search/
    │   │       └── page.tsx           # Eğitmen arama & keşif
    │   │
    │   └── api/                       # Next.js API Routes
    │       ├── auth/
    │       │   ├── login/
    │       │   │   └── route.ts       # POST /api/auth/login
    │       │   ├── register/
    │       │   │   └── route.ts       # POST /api/auth/register
    │       │   └── logout/
    │       │       └── route.ts       # POST /api/auth/logout
    │       ├── trainers/
    │       │   ├── route.ts           # GET (list), POST (create)
    │       │   ├── search/
    │       │   │   └── route.ts       # GET /api/trainers/search
    │       │   ├── recommended/
    │       │   │   └── route.ts       # GET /api/trainers/recommended
    │       │   ├── export/
    │       │   │   └── route.ts       # GET /api/trainers/export (CSV)
    │       │   └── [id]/
    │       │       ├── route.ts       # GET, PUT, PATCH (soft delete)
    │       │       └── stats/
    │       │           └── route.ts   # GET /api/trainers/[id]/stats — avg puan + yıllık sayım
    │       ├── skills/
    │       │   ├── route.ts           # GET (catalog), POST (create)
    │       │   └── [id]/
    │       │       └── route.ts       # PUT, PATCH (soft delete)
    │       ├── trainings/
    │       │   ├── route.ts           # GET (list), POST (create)
    │       │   └── [id]/
    │       │       ├── route.ts       # GET, PUT
    │       │       ├── complete/
    │       │       │   └── route.ts   # POST — durum makinesi: planned→completed
    │       │       └── cancel/
    │       │           └── route.ts   # POST — durum makinesi: planned→cancelled
    │       ├── evaluations/
    │       │   └── route.ts           # POST (puan ekle, trainer ortalamasını güncelle)
    │       └── dashboard/
    │           └── route.ts           # GET — takvim + aggregation data
    │
    ├── components/
    │   ├── ui/                        # shadcn/ui bileşenleri (npx shadcn-ui add ile eklenir)
    │   │   ├── button.tsx             # Primary: #FFD100 bg, #1A1A1A text
    │   │   ├── input.tsx
    │   │   ├── dialog.tsx
    │   │   ├── badge.tsx              # Durum renkleri: success/warning/destructive
    │   │   ├── select.tsx
    │   │   └── popover.tsx
    │   ├── layout/                    # Uygulama iskelet bileşenleri
    │   │   ├── Sidebar.tsx            # 240px sol nav (#1A1A1A bg, #FFD100 aktif gösterge)
    │   │   └── AppLayout.tsx          # Sidebar + içerik alanı composition
    │   └── features/
    │       ├── trainers/
    │       │   ├── TrainerCard.tsx
    │       │   ├── TrainerForm.tsx
    │       │   ├── TrainerSkillChips.tsx
    │       │   └── TrainerBarChart.tsx    # Puan bar grafik
    │       ├── trainings/
    │       │   ├── TrainingWizard.tsx     # 3 adımlı wizard
    │       │   ├── TrainingWizardStep1.tsx
    │       │   ├── TrainingWizardStep2.tsx
    │       │   ├── TrainingWizardStep3.tsx
    │       │   └── ConflictWarning.tsx    # Çakışma uyarısı
    │       ├── search/
    │       │   ├── SearchFilters.tsx      # Chip-based filtreler
    │       │   └── RecommendedTrainers.tsx
    │       └── dashboard/
    │           ├── CalendarView.tsx       # Görünüm switcher
    │           ├── MonthView.tsx
    │           ├── WeekView.tsx
    │           └── ListView.tsx
    │
    ├── lib/
    │   ├── db.ts                      # MongoDB singleton bağlantısı
    │   ├── auth.ts                    # JWT sign/verify, cookie helper'ları
    │   ├── apiHandler.ts              # Merkezi error handling wrapper
    │   ├── csvExport.ts               # CSV dışa aktarma utility
    │   └── schemas/                   # Paylaşılan Zod schema'ları
    │       ├── trainer.schema.ts
    │       ├── skill.schema.ts
    │       ├── training.schema.ts
    │       └── evaluation.schema.ts
    │
    ├── models/                        # Mongoose modelleri
    │   ├── User.ts                    # Koordinatör hesabı
    │   ├── Trainer.ts                 # isActive soft delete
    │   ├── Skill.ts                   # Merkezi katalog, isActive soft delete
    │   ├── Training.ts                # Durum: planned / completed / cancelled
    │   └── Evaluation.ts              # Eğitim başına puan kaydı
    │
    ├── hooks/                         # React Query hook'ları
    │   ├── useTrainers.ts
    │   ├── useSkills.ts
    │   ├── useTrainings.ts
    │   ├── useTrainerStats.ts         # GET /api/trainers/[id]/stats — avg puan + bar grafik
    │   └── useDashboard.ts
    │
    └── types/                         # Paylaşılan TypeScript tipleri
        ├── trainer.types.ts
        ├── training.types.ts
        └── api.types.ts               # ApiResponse<T> generic tipi
```

### Mimari Sınırlar

**API Sınırı:**
- `middleware.ts` — `/api/auth/*` hariç tüm route'larda JWT doğrulaması
- `(auth)/` sayfaları public; `(protected)/` sayfaları client-side auth kontrolü

**Data Sınırı:**
- `src/models/` — tek DB erişim noktası; API route'lar doğrudan modelleri kullanır
- MongoDB Atlas — uygulama dışarıdan sadece Mongoose üzerinden erişir

**State Sınırı:**
- React Query cache — component'lar state'i `hooks/` üzerinden alır, API'yi direkt çağırmaz
- Auth state — yalnızca `AuthContext` üzerinden erişilir

**Validasyon Sınırı:**
- Zod `schemas/` — client form validasyonu ve API route parse'ında aynı schema kullanılır

### Veri Akışı

```
Component
  → useXxx hook (React Query)
    → GET/POST /api/xxx
      → apiHandler wrapper
        → Zod.parse(request)
          → Mongoose Model.find/create/update
            → MongoDB Atlas
```

### Integration Points

**Eğitim Tamamlama Akışı (Cross-cutting):**
```
POST /api/trainings/:id/complete
  → Training.status = 'completed'
  → Evaluation.score kaydedilir
  → Trainer.averageScore aggregation ile güncellenir
  → React Query: ['trainers', id] cache invalidate
```

**Çakışma Kontrolü (Conflict Check):**
```
POST /api/trainings (create)
  → Training.find({ trainerId, date: { $gte, $lte }, status: 'planned' })
  → Çakışma varsa: 409 + { code: 'CONFLICT', conflictingTraining: {...} }
  → Çakışma yoksa: Training.create(...)
```

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:** Tüm teknoloji seçimleri birbirleriyle uyumlu — Next.js 15 + Mongoose + React Query + React Hook Form + Zod + JWT httpOnly cookie kombinasyonu çakışmasız çalışır.

**Pattern Consistency:** Naming, structure ve process pattern'ları teknoloji stack'iyle tam uyumlu. Soft delete ve API envelope kuralları tutarlı biçimde tanımlandı.

**Structure Alignment:** Proje yapısı tüm mimari kararları destekler; sınırlar net biçimde belirlenmiş.

### Requirements Coverage Validation ✅

| Kategori | FR'lar | Durum |
|----------|--------|-------|
| Kimlik Yönetimi | FR1-3 | ✅ |
| Eğitmen Yönetimi | FR4-9 | ✅ |
| Skill Kataloğu | FR10-16 | ✅ |
| Eğitim Yönetimi | FR17-25 | ✅ |
| Eğitmen Arama & Keşif | FR26-33 | ✅ |
| Takvim & Dashboard | FR34-39 | ✅ |
| Değerlendirme & Puanlama | FR40-43 | ✅ |
| NFR (Performans + Güvenlik) | NFR1-9 | ✅ |

### Architecture Completeness Checklist

**Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Gap Analysis Results

**Kritik Gap:** Yok

**Önemli Gap (implementasyona bırakılan):**
- MongoDB compound index stratejisi — `Trainer.ts` ve `Training.ts` model dosyalarında implementasyon sırasında tanımlanacak. Bloklamaz.

**Nice-to-Have:**
- Test coverage hedefleri — MVP sonrası
- Production monitoring (Sentry) — MVP sonrası

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High

**Key Strengths:**
- Soft delete pattern tüm sorgularda zorunlu kural olarak tanımlandı — fiziksel silme riski sıfır
- API envelope tutarlılığı tüm route'larda zorunlu — hata yönetimi öngörülebilir
- Cross-cutting concern'ler (çakışma kontrolü, puan güncelleme) veri akışıyla belgelendi
- AI agent çakışma noktaları 6 alanda tespit edilip çözüldü

**Areas for Future Enhancement:**
- MongoDB compound index stratejisi (model implementasyonunda tanımlanacak)
- Production monitoring — Sentry (post-MVP)
- Test coverage hedefleri (post-MVP)

### Implementation Handoff

**AI Agent Guidelines:**
- Tüm mimari kararları belgede tanımlandığı şekilde uygula
- Implementation patterns'i tüm bileşenlerde tutarlı kullan
- Proje yapısına ve sınırlara uy
- Mimari sorular için bu dokümana başvur

**First Implementation Priority:**
```bash
npx create-next-app@latest tagman \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --turbopack \
  --src-dir \
  --import-alias "@/*"
```
