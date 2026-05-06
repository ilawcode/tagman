# Story 1.1: Proje Başlatma & Temel Altyapı

## Metadata
- **Epic:** 1 — Proje Altyapısı & Kimlik Yönetimi
- **Story:** 1.1
- **Status:** ready-for-dev
- **Priority:** Critical — tüm sonraki story'ler bu kuruluma bağımlı

## User Story

Koordinatör olarak,
Çalışan bir temel altyapıya (DB bağlantısı, auth middleware, API wrapper, design system) sahip olmak istiyorum,
Böylece tüm uygulama özellikleri güvenli ve tutarlı bir zemin üzerinde inşa edilebilsin.

## Kabul Kriterleri

**AC1 — Proje Bootstrap:**
- `create-next-app@latest` starter ile proje oluşturulmuş (TypeScript, Tailwind, App Router, Turbopack, src-dir)
- Dev server başlatıldığında `http://localhost:3000` hatasız açılır

**AC2 — MongoDB Singleton:**
- Tüm paketler kurulmuş (bkz. Paket Listesi)
- `src/lib/db.ts` singleton ile MongoDB Atlas'a bağlanır
- `MONGODB_URI` env eksikse başlangıçta anlaşılır hata fırlatır

**AC3 — JWT Middleware:**
- `src/middleware.ts` yapılandırılmış
- `/api/auth/*` dışındaki tüm `/api/*` istekleri JWT doğrulamasından geçer
- Geçersiz/eksik token → `{ data: null, error: { code: "UNAUTHORIZED", message: "Yetkisiz erişim" } }` + 401
- Korumalı page route'ları (protected group) için → `/login`'e redirect

**AC4 — API Handler Wrapper:**
- `src/lib/apiHandler.ts` tüm route'lar tarafından kullanılabilir
- İşlenmemiş exception → `{ data: null, error: { code: "INTERNAL_ERROR", message: "Sunucu hatası" } }` + 500

**AC5 — shadcn/ui + Design Tokens:**
- `npx shadcn-ui@latest init` tamamlanmış
- shadcn/ui bileşenleri `src/components/ui/` altında erişilebilir
- `tailwind.config.ts`'de Turkcell design token'ları tanımlı (bkz. Renk Tablosu)

**AC6 — Inter Font:**
- `next/font/google` ile Inter yüklü
- `globals.css` Tailwind CSS değişkenlerini içerir; tüm metin Inter ile render edilir

**AC7 — Sidebar Layout:**
- `src/components/layout/Sidebar.tsx` — 240px sabit, `#1A1A1A` bg, `#FFD100` active indicator
- `src/components/layout/AppLayout.tsx` — sidebar + içerik alanı composition
- `(protected)/layout.tsx`'te AppLayout kullanılır
- Sidebar menü öğeleri: Dashboard, Eğitmenler, Skill Kataloğu, Eğitimler

---

## Teknik Gereksinimler

### 1. Starter Komutu (EXACT)

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

### 2. Paket Kurulumu

```bash
npm install mongoose jsonwebtoken bcryptjs
npm install @types/jsonwebtoken @types/bcryptjs --save-dev
npm install @tanstack/react-query @tanstack/react-query-devtools
npm install react-hook-form @hookform/resolvers zod
npm install recharts
npm install jose
```

> **Not:** `jose` paketi zorunlu — `jsonwebtoken` Edge Runtime'da çalışmaz, `middleware.ts` Edge Runtime kullanır. `jose` Edge-uyumludur. `jsonwebtoken` API route'larda (Node.js runtime) kullanılabilir.

### 3. shadcn/ui Kurulum

```bash
npx shadcn-ui@latest init
```

**Sorulara verilecek yanıtlar:**
- Style: `default`
- Base color: `slate`
- Global CSS file: `src/app/globals.css`
- CSS variables: `yes`
- Tailwind config: `tailwind.config.ts`
- Components alias: `@/components/ui`
- Utils alias: `@/lib/utils`
- React Server Components: `yes`

### 4. Tailwind Design Tokens

`tailwind.config.ts`'e tam olarak şu renkleri ekle:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFD100',              // CTA butonları, aktif chip, sidebar göstergesi
        'primary-foreground': '#1A1A1A', // Primary buton üzeri metin
        background: '#F5F5F5',           // Sayfa arka planı
        surface: '#FFFFFF',              // Kart, panel, modal yüzeyi
        'sidebar-bg': '#1A1A1A',         // Sol navigasyon arka planı
        'sidebar-text': '#FFFFFF',       // Sidebar metin/ikon
        'sidebar-active': '#FFD100',     // Aktif sayfa sol kenarlık
        success: '#22C55E',              // Tamamlandı durumu
        warning: '#F59E0B',              // Çakışma soft warning
        destructive: '#EF4444',          // İptal durumu, hata
        border: '#E5E5E5',               // Kart kenarlıkları
        muted: '#737373',                // İkincil metin
      },
    },
  },
  plugins: [],
}

export default config
```

---

## Dosya Yapısı (Oluşturulacaklar)

```
src/
├── middleware.ts                        # JWT auth — tüm korumalı route'lar
├── app/
│   ├── layout.tsx                       # Root layout: Inter + QueryClientProvider + AuthProvider
│   ├── globals.css                      # Tailwind + CSS değişkenleri
│   ├── (auth)/
│   │   ├── layout.tsx                   # Minimal (sidebar yok)
│   │   ├── login/page.tsx               # Placeholder — Story 1.3'te doldurulacak
│   │   └── register/page.tsx            # Placeholder — Story 1.2'de doldurulacak
│   └── (protected)/
│       ├── layout.tsx                   # AuthGuard + AppLayout
│       └── dashboard/page.tsx           # Placeholder — Story 5.1'de doldurulacak
├── components/
│   ├── ui/                              # shadcn/ui (otomatik — elle dokunma)
│   └── layout/
│       ├── Sidebar.tsx                  # 240px, #1A1A1A bg, #FFD100 aktif gösterge
│       └── AppLayout.tsx                # Sidebar + içerik composition
├── lib/
│   ├── db.ts                            # MongoDB singleton
│   ├── auth.ts                          # JWT sign/verify (Node.js) + cookie helper'ları
│   ├── apiHandler.ts                    # Merkezi error handling wrapper (App Router)
│   └── schemas/                         # (Boş klasör — sonraki story'ler ekleyecek)
├── models/                              # (Boş klasör — sonraki story'ler ekleyecek)
├── hooks/                               # (Boş klasör — sonraki story'ler ekleyecek)
└── types/
    └── api.types.ts                     # ApiResponse<T> generic tip
```

---

## Kritik Implementasyon Detayları

### db.ts — MongoDB Singleton

```typescript
// src/lib/db.ts
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI as string

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not defined')
}

declare global {
  var mongooseCache: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
}

const cached = global.mongooseCache ?? { conn: null, promise: null }
global.mongooseCache = cached

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false })
  }
  cached.conn = await cached.promise
  return cached.conn
}
```

### auth.ts — JWT Helpers

```typescript
// src/lib/auth.ts
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET as string
const COOKIE_NAME = 'auth-token'
const EXPIRES_IN = '8h'

export function signToken(payload: { userId: string; email: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN })
}

export function verifyToken(token: string): { userId: string; email: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string }
  } catch {
    return null
  }
}

export function setAuthCookie(response: NextResponse, token: string): void {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 8, // 8 saat
    path: '/',
  })
}

export function clearAuthCookie(response: NextResponse): void {
  response.cookies.set(COOKIE_NAME, '', { maxAge: 0, path: '/' })
}

export function getTokenFromRequest(): string | null {
  const cookieStore = cookies()
  return cookieStore.get(COOKIE_NAME)?.value ?? null
}
```

### middleware.ts — Edge Runtime JWT (jose kullanır)

```typescript
// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)
const COOKIE_NAME = 'auth-token'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Auth endpoint'leri public — geç
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  const token = request.cookies.get(COOKIE_NAME)?.value

  if (!token) {
    // API isteği → 401 JSON
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { data: null, error: { code: 'UNAUTHORIZED', message: 'Yetkisiz erişim' } },
        { status: 401 }
      )
    }
    // Sayfa isteği → login'e redirect
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    await jwtVerify(token, JWT_SECRET)
    return NextResponse.next()
  } catch {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { data: null, error: { code: 'UNAUTHORIZED', message: 'Yetkisiz erişim' } },
        { status: 401 }
      )
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: [
    '/api/((?!auth).*)',        // /api/auth/* hariç tüm API route'lar
    '/((?!login|register|_next/static|_next/image|favicon.ico).*)',
  ],
}
```

> **⚠️ Kritik Fark:** `middleware.ts` `jose` kullanır (Edge uyumlu). `auth.ts` `jsonwebtoken` kullanır (Node.js — yalnızca API route'larda). İkisini karıştırma.

### apiHandler.ts — App Router Version

```typescript
// src/lib/apiHandler.ts
import { NextRequest, NextResponse } from 'next/server'

type RouteHandler = (req: NextRequest, context?: { params: Record<string, string> }) => Promise<NextResponse>

export function apiHandler(handler: RouteHandler): RouteHandler {
  return async (req, context) => {
    try {
      return await handler(req, context)
    } catch (error) {
      console.error('[apiHandler] Unhandled error:', error)
      return NextResponse.json(
        { data: null, error: { code: 'INTERNAL_ERROR', message: 'Sunucu hatası' } },
        { status: 500 }
      )
    }
  }
}
```

**Kullanım (her API route):**
```typescript
// src/app/api/trainers/route.ts
import { apiHandler } from '@/lib/apiHandler'
import { NextRequest, NextResponse } from 'next/server'

export const GET = apiHandler(async (req) => {
  // ...
  return NextResponse.json({ data: trainers, error: null })
})
```

### types/api.types.ts

```typescript
// src/types/api.types.ts
export type ApiResponse<T> =
  | { data: T; error: null }
  | { data: null; error: { code: string; message: string } }
```

### Root Layout (app/layout.tsx)

```typescript
// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { AuthProvider } from '@/components/providers/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Akademi Portalı',
  description: 'Kurumsal Eğitim Yönetimi',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
```

> `QueryProvider` ve `AuthProvider` `'use client'` direktifi içeren wrapper'lar. Root layout Server Component olarak kalır.

### Sidebar.tsx

```typescript
// src/components/layout/Sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Eğitmenler', href: '/trainers' },
  { label: 'Skill Kataloğu', href: '/skills' },
  { label: 'Eğitimler', href: '/trainings' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 min-h-screen bg-sidebar-bg flex flex-col">
      <div className="p-6">
        <h1 className="text-white font-semibold text-lg">Akademi Portalı</h1>
      </div>
      <nav className="flex-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-6 py-3 text-sidebar-text hover:bg-white/5 transition-colors border-l-4 ${
                isActive ? 'border-sidebar-active bg-white/10' : 'border-transparent'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
```

### AppLayout.tsx

```typescript
// src/components/layout/AppLayout.tsx
import { Sidebar } from './Sidebar'

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-background">
        <div className="max-w-[1200px] mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
```

### (protected)/layout.tsx

```typescript
// src/app/(protected)/layout.tsx
import { AppLayout } from '@/components/layout/AppLayout'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  // Middleware JWT doğrulamasını zaten yapar
  // Bu layout sadece AppLayout wrapper'ı sağlar
  return <AppLayout>{children}</AppLayout>
}
```

---

## Environment Variables

**`.env.local` (git'e girmiyor — create et):**
```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/tagman?retryWrites=true&w=majority
JWT_SECRET=<minimum-32-karakter-rastgele-string>
```

**`.env.example` (git'e giriyor — create et):**
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/tagman?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
```

**`.gitignore`'a ekle (yoksa):** `.env.local`

---

## Zorunlu Kurallar (Tüm Sonraki Story'ler İçin)

Bu kurallar bu story'de kurulur ve tüm projede uygulanır:

| Kural | Zorunluluk |
|-------|-----------|
| Her API route'ta `apiHandler` wrapper'ı | Zorunlu |
| Her response `{ data, error }` envelope formatı | Zorunlu |
| Her sorguda `{ isActive: true }` filtresi | Zorunlu |
| Fiziksel silme (`findByIdAndDelete`) | ❌ Yasak |
| Tarih formatı: ISO 8601 string | Zorunlu |
| Alan adları: camelCase (DB + API + TypeScript) | Zorunlu |
| `middleware.ts`'de `jose` kullan | Zorunlu |
| `auth.ts`'de `jsonwebtoken` kullan | Node.js API route'larda |

---

## Anti-Pattern'ler

```typescript
// ❌ Fiziksel silme — ASLA
await Trainer.findByIdAndDelete(id)

// ✅ Soft delete
await Trainer.findByIdAndUpdate(id, { isActive: false })

// ❌ isActive filtresi eksik
const trainers = await Trainer.find({ skill: skillId })

// ✅ Her zaman isActive filtresi
const trainers = await Trainer.find({ skill: skillId, isActive: true })

// ❌ Ham response
return NextResponse.json({ trainers: [...] })

// ✅ Envelope
return NextResponse.json({ data: { trainers: [...] }, error: null })

// ❌ middleware.ts'de jsonwebtoken kullanımı (Edge Runtime — çalışmaz)
import jwt from 'jsonwebtoken'  // middleware.ts içinde YASAK

// ✅ middleware.ts'de jose kullan
import { jwtVerify } from 'jose'
```

---

## Bu Story Sonrası Kurulacak Olmayan Şeyler

Bu story kapsamı **dışında** (gelecek story'ler):
- Mongoose modelleri (User, Trainer, Skill, Training, Evaluation) — Story 1.2+
- Zod schema'ları — Story 1.2+
- React Query hook'ları — Story 2.1+
- Login/Register form UI — Story 1.2, 1.3
- Dashboard UI — Story 5.1

Bu story yalnızca boş placeholder page'ler + tam altyapı içerir.

---

## Test Edilebilirlik

Story tamamlandığında manuel doğrulama:

1. `npm run dev` → `localhost:3000` hatasız açılır
2. `/login` ve `/register` erişilebilir (Auth layout, sidebar yok)
3. `/dashboard` → `/login`'e redirect (JWT yok)
4. `GET /api/trainers` → 401 JSON (`{ data: null, error: { code: "UNAUTHORIZED" } }`)
5. `GET /api/auth/login` → 404 (henüz route yok ama 401 değil — middleware bypass çalışıyor)
6. MongoDB bağlantısı: `console.log` ile `connectDB()` başarılı bağlantı log'u
7. Sidebar: `/dashboard`'a gidildiğinde 240px koyu sidebar görünür, "Dashboard" aktif (sarı kenarlık)

---

## Dev Notları

- `QueryProvider` ve `AuthProvider` ayrı `'use client'` wrapper dosyaları olmalı (`src/components/providers/`) — root layout Server Component kalacak
- shadcn/ui init sonrası `components.json` dosyası oluşur — git'e ekle
- `tailwind.config.ts`'deki `content` array'ini shadcn/ui bazı durumlarda değiştiriyor — override yapılmış olabilir, manuel kontrol et
- `globals.css`'te shadcn/ui kendi CSS değişkenlerini ekler — Turkcell token'larını bunların üzerine yaz (dosyanın en altına)
- `recharts` yalnızca profil sayfasında kullanılacak (Story 4.3) — bu story'de import etme
