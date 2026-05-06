---
stepsCompleted: [1, 2, 3, 4]
status: 'complete'
completedAt: '2026-05-06'
inputDocuments: [prd.md, architecture.md]
---

# Akademi Portalı - Epic Breakdown

## Overview

Bu doküman, Akademi Portalı'nın PRD ve Architecture gereksinimlerini uygulanabilir story'lere dönüştüren tam epic ve story dökümünü içermektedir.

## Requirements Inventory

### Functional Requirements

FR1: Koordinatör sisteme kayıt olabilir
FR2: Koordinatör sisteme giriş yapabilir
FR3: Koordinatör oturumunu sonlandırabilir
FR4: Koordinatör yeni eğitmen kaydı oluşturabilir (ad, soyad, kurum içi/dışı, özgeçmiş)
FR5: Koordinatör kurum dışı eğitmen için danışmanlık firması bilgisi girebilir
FR6: Koordinatör mevcut eğitmen profilini düzenleyebilir
FR7: Koordinatör eğitmeni pasife alabilir (soft delete)
FR8: Koordinatör pasif eğitmeni yeniden aktive edebilir
FR9: Sistem pasif eğitmeni yeni atamalarda ve arama sonuçlarında listelemez
FR10: Koordinatör merkezi skill kataloğuna yeni skill ekleyebilir
FR11: Koordinatör bir eğitmene katalogdan skill atayabilir ve 10 üzerinden deneyim puanı girebilir
FR12: Koordinatör bir eğitmenin mevcut skill puanını güncelleyebilir
FR13: Koordinatör eğitmene atanmış bir skill'i profilden kaldırabilir
FR14: Koordinatör katalogdaki bir skill'i pasife alabilir
FR15: Sistem pasif skill'i yeni atamalarda göstermez; mevcut kayıtlar korunur
FR16: Sistem her skill'in sisteme kayıt tarihini kaydeder ve görüntüler
FR17: Koordinatör tek wizard akışında eğitim tanımlayabilir ve eğitmen atayabilir
FR18: Koordinatör bir eğitime tek eğitmen atayabilir
FR19: Koordinatör bir eğitime birden fazla eğitmen (co-trainer) atayabilir
FR20: Sistem atama sırasında eğitmenin (ana ve co-trainer) o günkü doluluk durumunu gösterir ve çakışma varsa uyarır
FR21: Koordinatör eğitimi iptal edebilir ve iptal notu ekleyebilir
FR22: Sistem iptal edilen eğitimi silmez; takvimde farklı renk/ikon ve notla gösterir
FR23: Sistem iptal edilen eğitime atanmış eğitmenlerin o günkü çakışma bloğunu kaldırır
FR24: Koordinatör eğitimi tamamlandı olarak işaretleyebilir
FR25: Sistem eğitimi tamamlandı olarak işaretlerken puan girişini zorunlu kılar
FR26: Koordinatör eğitmenleri ad/soyad, kurum içi/dışı, danışmanlık firması, skill ve minimum puan eşiği kriterlerine göre filtreleyebilir
FR27: Koordinatör arama filtrelerini chip olarak ekleyip kaldırabilir
FR28: Sistem arama sonuçlarında eğitmenin adı, soyadı, kurum içi/dışı durumu ve ortalama puanını ana görünümde gösterir
FR29: Koordinatör arama sonuçlarında ikincil görünüm olarak eğitmenin skill listesini görebilir
FR30: Koordinatör eğitmen arama sonuçlarını CSV olarak indirebilir
FR31: Koordinatör eğitmen profilini read-only modda görüntüleyebilir
FR32: Koordinatör eğitmen profilini edit modunda düzenleyebilir
FR33: Sistem atama ekranında ilgili eğitim konusunda en yüksek puanlı ve o gün müsait eğitmenleri önerir
FR34: Koordinatör eğitimlerini takvim görünümünde görebilir
FR35: Koordinatör eğitimlerini liste görünümünde görebilir
FR36: Koordinatör eğitimlerini kart görünümünde görebilir
FR37: Koordinatör yalnızca kendi tanımladığı eğitimleri veya tüm akademi eğitimlerini görüntüleme arasında geçiş yapabilir
FR38: Dashboard açılışında bu haftaki ve yaklaşan eğitimlerin özeti görünür
FR39: Sistem takvimde iptal edilen eğitimleri farklı renk/ikon ile gösterir
FR40: Koordinatör tamamlanan eğitim için eğitmene 10 üzerinden puan girebilir
FR41: Sistem eğitmenin ortalama puanını tamamlanan tüm eğitimlerden otomatik hesaplar ve günceller
FR42: Eğitmen profil sayfasında yıllık eğitim sayısı bar grafik olarak görüntülenir
FR43: Eğitmenin ortalama puanı arama sonuçlarında ve profil sayfasında görünür

### NonFunctional Requirements

NFR1: Eğitmen arama sorguları 1 saniye içinde sonuç döndürmelidir
NFR2: Önerilen Eğitmenler sorgusu (puan + müsaitlik aggregation) 1,5 saniye içinde tamamlanmalıdır
NFR3: Eğitmen profil sayfası bar grafik ve ortalama puan verileri 2 saniye içinde yüklenmelidir
NFR4: SPA sayfa geçişleri 300ms altında tamamlanmalıdır
NFR5: Tüm API istekleri kimlik doğrulaması gerektirmelidir; doğrulanmamış istekler reddedilmelidir
NFR6: Koordinatör şifreleri bcrypt ile hash'lenerek saklanmalıdır
NFR7: JWT token'ları 8 saat süresiyle sınırlandırılmalı ve oturum sonlandırmada geçersiz kılınmalıdır
NFR8: Tüm istemci-sunucu iletişimi HTTPS üzerinden yapılmalıdır
NFR9: Eğitmen kişisel verileri yalnızca oturum açmış koordinatörlere erişilebilir olmalıdır

### Additional Requirements

- Proje `create-next-app@latest` starter ile başlatılmalıdır: `npx create-next-app@latest tagman --typescript --tailwind --eslint --app --turbopack --src-dir --import-alias "@/*"`
- MongoDB bağlantısı singleton pattern ile `src/lib/db.ts`'de yönetilmelidir
- JWT httpOnly cookie ile depolanmalı; refresh token kullanılmamalıdır
- Tüm API route'ları `src/lib/apiHandler.ts` wrapper'ı kullanmalıdır
- Soft delete: eğitmen ve skill için `isActive` flag; fiziksel silme yasaktır
- Tüm API response'ları `{ data: T, error: null } | { data: null, error: { code, message } }` envelope formatında olmalıdır
- Mongoose modelleri `src/models/` altında; Zod schema'ları `src/lib/schemas/` altında tutulmalıdır
- React Query server state için; React Context yalnızca auth state için kullanılmalıdır
- React Hook Form + Zod zodResolver form validasyonunda kullanılmalıdır
- MongoDB compound index'ler arama performansı için `Trainer` ve `Training` modellerinde tanımlanmalıdır (NFR1, NFR2)

### UX Design Requirements

**Kaynak:** `ux-design-specification.md` (tamamlanmış — stepsCompleted: [1-8])

**Renk Sistemi (Turkcell Kurumsal Marka)**

| Token | Değer | Kullanım |
|-------|-------|---------|
| `primary` | `#FFD100` | CTA butonları, aktif chip, sidebar aktif gösterge |
| `primary-foreground` | `#1A1A1A` | Primary buton üzeri metin |
| `background` | `#F5F5F5` | Sayfa arka planı |
| `surface` | `#FFFFFF` | Kart, panel, modal yüzeyi |
| `sidebar-bg` | `#1A1A1A` | Sol navigasyon arka planı |
| `sidebar-text` | `#FFFFFF` | Sidebar metin ve ikonlar |
| `sidebar-active` | `#FFD100` | Aktif sayfa sol kenarlık göstergesi |
| `success` | `#22C55E` | Tamamlandı durumu, müsaitlik |
| `warning` | `#F59E0B` | Çakışma soft warning |
| `destructive` | `#EF4444` | İptal durumu, hata |

**Durum Renk Kodlaması**
- `planned` → mavi (`#3B82F6`)
- `completed` → yeşil/success (`#22C55E`)
- `cancelled` → kırmızı/destructive (`#EF4444`)

**Tema:** Yalnızca Light Theme — dark mode kapsam dışı

**Bileşen Kütüphanesi:** `shadcn/ui` + Tailwind CSS
- Button, Input, Select, Textarea, Dialog, Badge, Popover bileşenleri kullanılacak
- Kurulum: `npx shadcn-ui@latest init` (Epic 1 Story 1.1)

**Tipografi:** Inter (Google Fonts, `next/font/google`)
- Satır yüksekliği: 1.5 | Köşe yarıçapı: 8px

**Navigasyon:** Linear-style sol sidebar
- Genişlik: 240px sabit
- Arka plan: `#1A1A1A` (sidebar-bg)
- Aktif sayfa: `#FFD100` sol kenarlık göstergesi
- Menü öğeleri: Dashboard, Eğitmenler, Skill Kataloğu, Eğitimler

**Chip Filtreler:** Anlık güncelleme — filtre ekle/kaldır anında sonuç günceller; debounce yok, sayfa yenilenmez

**Eğitmen Kart Tasarımı:** "Tek Bakışta Karar"
- İsim + soyad, ortalama puan (boş = "—"), kurum içi/dışı badge, müsaitlik göstergesi
- Profile girmeden atama kararı verilebilecek yoğunlukta bilgi

### FR Coverage Map

FR1: Epic 1 — Koordinatör kayıt olabilir
FR2: Epic 1 — Koordinatör giriş yapabilir
FR3: Epic 1 — Koordinatör oturumu sonlandırabilir
FR4: Epic 2 — Yeni eğitmen oluşturma
FR5: Epic 2 — Danışmanlık firması alanı (kurum dışı)
FR6: Epic 2 — Eğitmen profili düzenleme
FR7: Epic 2 — Eğitmen soft delete
FR8: Epic 2 — Pasif eğitmeni aktive etme
FR9: Epic 2 — Pasif eğitmen filtreleme
FR10: Epic 2 — Skill kataloğuna yeni skill ekleme
FR11: Epic 2 — Eğitmene skill atama + puan girişi
FR12: Epic 2 — Eğitmen skill puanı güncelleme
FR13: Epic 2 — Eğitmenden skill kaldırma
FR14: Epic 2 — Skill soft delete
FR15: Epic 2 — Pasif skill filtreleme
FR16: Epic 2 — Skill kayıt tarihi
FR17: Epic 3 — Eğitim tanımlama + atama wizard
FR18: Epic 3 — Tek eğitmen atama
FR19: Epic 3 — Co-trainer atama
FR20: Epic 3 — Çakışma kontrolü + uyarı
FR21: Epic 3 — Eğitim iptali + not
FR22: Epic 3 — İptal durumu görselleştirme
FR23: Epic 3 — İptal sonrası çakışma bloğu kaldırma
FR24: Epic 3 — Eğitimi tamamlandı işaretleme
FR25: Epic 3 — Tamamlama sırasında zorunlu puan girişi
FR26: Epic 4 — Çok kriterli eğitmen arama
FR27: Epic 4 — Chip filtreler
FR28: Epic 4 — Arama sonuçları görünümü (ad, kurum, ortalama puan)
FR29: Epic 4 — İkincil skill listesi görünümü
FR30: Epic 4 — CSV export
FR31: Epic 4 — Eğitmen profil read-only görünümü
FR32: Epic 4 — Eğitmen profil edit modu
FR33: Epic 4 — Önerilen eğitmenler
FR34: Epic 5 — Takvim görünümü
FR35: Epic 5 — Liste görünümü
FR36: Epic 5 — Kart görünümü
FR37: Epic 5 — Kendi/tüm akademi filtresi
FR38: Epic 5 — Dashboard haftalık özet
FR39: Epic 5 — İptal renk kodlaması takvimde
FR40: Epic 3 — Eğitime puan girişi
FR41: Epic 3 — Otomatik ortalama puan hesabı
FR42: Epic 3 — Yıllık eğitim bar grafik
FR43: Epic 3 — Ortalama puan profil + arama görünümü

## Epic List

### Epic 1: Proje Altyapısı & Kimlik Yönetimi
Koordinatör sisteme kaydolabilir, giriş yapabilir ve oturumunu güvenli biçimde yönetebilir. Tüm uygulama altyapısı (proje başlatma, DB bağlantısı, JWT auth middleware) bu epic ile kurulur.
**FRs covered:** FR1, FR2, FR3
**Architecture:** create-next-app@latest starter, MongoDB singleton, JWT httpOnly cookie, Next.js middleware, apiHandler wrapper

### Epic 2: Eğitmen & Skill Yönetimi
Koordinatör eğitmen profilleri oluşturabilir, düzenleyebilir, pasife alabilir; merkezi skill kataloğunu yönetebilir ve eğitmenlere skill ile deneyim puanı atayabilir.
**FRs covered:** FR4, FR5, FR6, FR7, FR8, FR9, FR10, FR11, FR12, FR13, FR14, FR15, FR16

### Epic 3: Eğitim Yönetimi & Değerlendirme
Koordinatör wizard akışında eğitim oluşturup eğitmen (ve co-trainer) atayabilir; çakışma uyarısı alabilir; eğitimi iptal edebilir veya tamamlandı işaretleyerek zorunlu puan girebilir. Eğitmen ortalama puanı ve yıllık bar grafik otomatik güncellenir.
**FRs covered:** FR17, FR18, FR19, FR20, FR21, FR22, FR23, FR24, FR25, FR40, FR41, FR42, FR43

### Epic 4: Eğitmen Arama, Keşif & Profil
Koordinatör chip filtrelerle eğitmen arayabilir, CSV indirebilir, eğitmen profilini read-only veya edit modunda açabilir ve atama ekranında önerilen eğitmenleri görebilir.
**FRs covered:** FR26, FR27, FR28, FR29, FR30, FR31, FR32, FR33

### Epic 5: Takvim & Dashboard
Koordinatör eğitimlerini takvim, liste ve kart görünümlerinde izleyebilir; kendi veya tüm akademi eğitimleri arasında geçiş yapabilir; dashboard'da haftalık özet ve iptal renk kodlamasını görebilir.
**FRs covered:** FR34, FR35, FR36, FR37, FR38, FR39

---

## Epic 1: Proje Altyapısı & Kimlik Yönetimi

Koordinatör sisteme kaydolabilir, giriş yapabilir ve oturumunu güvenli biçimde yönetebilir. Tüm uygulama altyapısı bu epic ile kurulur.

### Story 1.1: Proje Başlatma & Temel Altyapı

Koordinatör olarak,
Çalışan bir temel altyapıya (DB bağlantısı, auth middleware, API wrapper) sahip olmak istiyorum,
Böylece tüm uygulama özellikleri güvenli bir zemin üzerinde inşa edilebilsin.

**Acceptance Criteria:**

**Given** proje `create-next-app@latest` ile başlatılmış (TypeScript, Tailwind, App Router, Turbopack, src-dir)
**When** geliştirme sunucusu başlatıldığında
**Then** uygulama hatasız çalışır ve ana sayfa erişilebilir

**Given** gerekli paketler kurulmuş (mongoose, jsonwebtoken, bcryptjs, @tanstack/react-query, react-hook-form, zod)
**When** uygulama başladığında
**Then** MongoDB Atlas bağlantısı `src/lib/db.ts` singleton üzerinden kurulur

**Given** `src/middleware.ts` yapılandırılmış
**When** kimliği doğrulanmamış bir istek `/api/auth/*` dışında herhangi bir API route'una geldiğinde
**Then** `{ data: null, error: { code: "UNAUTHORIZED", message: "Yetkisiz erişim" } }` ile 401 döner

**Given** `src/lib/apiHandler.ts` wrapper uygulanmış
**When** herhangi bir API route'u işlenmemiş hata fırlattığında
**Then** standart hata envelope formatıyla 500 dönülür

**Given** `npx shadcn-ui@latest init` çalıştırılmış
**When** uygulama başladığında
**Then** shadcn/ui bileşenleri `src/components/ui/` altında erişilebilir durumdadır

**Given** `tailwind.config.ts` Turkcell design token'larıyla güncellenmiş
**When** Tailwind derlendiğinde
**Then** şu token'lar kullanılabilir: `primary: '#FFD100'`, `primary-foreground: '#1A1A1A'`, `background: '#F5F5F5'`, `surface: '#FFFFFF'`, `sidebar-bg: '#1A1A1A'`, `success: '#22C55E'`, `warning: '#F59E0B'`, `destructive: '#EF4444'`

**Given** `next/font/google` ile Inter yüklenmiş ve `globals.css`'e uygulanmış
**When** herhangi bir sayfa render edildiğinde
**Then** tüm metin Inter fontuyla görüntülenir; `globals.css` Tailwind CSS değişkenlerini içerir

**Given** sol sidebar layout bileşeni `src/components/layout/Sidebar.tsx` ve `src/components/layout/AppLayout.tsx` oluşturulmuş
**When** herhangi bir korumalı sayfaya gidildiğinde
**Then** 240px sabit sidebar (`#1A1A1A` arka plan, `#FFFFFF` metin) görünür; aktif sayfa `#FFD100` sol kenarlık göstergesiyle vurgulanır; menü öğeleri: Dashboard, Eğitmenler, Skill Kataloğu, Eğitimler

---

### Story 1.2: Koordinatör Kayıt

Koordinatör olarak,
E-posta ve şifreyle sisteme kayıt olmak istiyorum,
Böylece portala erişmek için kendi hesabım olsun.

**Acceptance Criteria:**

**Given** kayıt sayfası `/register` adresinde
**When** geçerli e-posta ve şifre (min 8 karakter) ile formu gönderirsem
**Then** hesap oluşturulur, şifre bcrypt ile hash'lenir, JWT httpOnly cookie set edilir ve dashboard'a yönlendirilirim

**Given** halihazırda kullanılmış bir e-posta ile kayıt denerken
**When** formu gönderirsem
**Then** "Bu e-posta adresi zaten kayıtlı" hata mesajı görünür

**Given** geçersiz e-posta formatı girildiğinde
**When** formu gönderirsem
**Then** Zod validasyonu alan hatası gösterir, form gönderilmez

**Given** başarılı kayıt sonrası
**When** hesap oluşturulduğunda
**Then** JWT token httpOnly cookie olarak set edilir (8 saat süre) ve kullanıcı kimliği doğrulanmış kabul edilir

---

### Story 1.3: Koordinatör Giriş & Çıkış

Koordinatör olarak,
E-posta ve şifreyle giriş yapıp işim bittiğinde çıkış yapabilmek istiyorum,
Böylece oturumum güvenli olsun ve kimliğimin doğrulandığını kontrol edebileyim.

**Acceptance Criteria:**

**Given** giriş sayfası `/login` adresinde
**When** geçerli kimlik bilgileriyle formu gönderirsem
**Then** JWT httpOnly cookie set edilir ve dashboard'a yönlendirilirim

**Given** yanlış şifre veya var olmayan e-posta girildiğinde
**When** giriş denersem
**Then** "E-posta veya şifre hatalı" mesajı görünür; hangisinin yanlış olduğu belirtilmez

**Given** giriş yapmış durumdayım
**When** çıkış yaparım
**Then** JWT cookie temizlenir ve `/login` sayfasına yönlendirilirim

**Given** giriş yapmamış durumdayım
**When** herhangi bir korumalı rotaya erişmeye çalıştığımda
**Then** `/login` sayfasına yönlendirilirim

---

## Epic 2: Eğitmen & Skill Yönetimi

Koordinatör eğitmen profilleri oluşturabilir, düzenleyebilir, pasife alabilir; merkezi skill kataloğunu yönetebilir ve eğitmenlere skill ile deneyim puanı atayabilir.

### Story 2.1: Skill Kataloğu Yönetimi

Koordinatör olarak,
Merkezi skill kataloğuna yeni skill eklemek ve artık kullanılmayan skill'leri pasife almak istiyorum,
Böylece eğitmen skill atamaları her zaman güncel ve kontrollü bir listeden yapılsın.

**Acceptance Criteria:**

**Given** `/skills` sayfasında
**When** yeni bir skill adı girip kaydedersem
**Then** skill `createdAt` zaman damgası ve `isActive: true` ile kataloga eklenir (FR10, FR16)

**Given** katalogda aktif bir skill var
**When** onu pasife alırsam
**Then** `isActive: false` olur; yeni eğitmen skill ataması dropdown'larında gösterilmez (FR14, FR15)

**Given** pasife alınmış bir skill
**When** o skill'i atanmış bir eğitmenin profilini görürsem
**Then** mevcut skill ataması hâlâ görünür (geçmiş kayıtlar korunur, FR15)

**Given** skills sayfası yüklendiğinde
**When** listeye bakarsam
**Then** her skill için adı ve sisteme eklenme tarihi görüntülenir (FR16)

**Given** katalogda aynı isimde (büyük/küçük harf fark etmez) aktif bir skill zaten varsa
**When** yeni skill kaydedilmeye çalışıldığında
**Then** "Bu skill adı zaten mevcut" hata mesajı gösterilir, kayıt yapılmaz

---

### Story 2.2: Eğitmen Oluşturma

Koordinatör olarak,
Yeni bir eğitmen profili temel bilgilerle oluşturmak istiyorum,
Böylece eğitmen sisteme dahil olsun ve skill ataması ile eğitim planlamasında kullanılabilsin.

**Acceptance Criteria:**

**Given** `/trainers/new` adresindeki yeni eğitmen formu
**When** ad, soyad, kurum içi/dışı durumu ve özgeçmiş metin alanını doldurup kaydedersem
**Then** eğitmen `isActive: true` ile oluşturulur ve eğitmenin profil sayfasına yönlendirilirim (FR4)

**Given** "Kurum Dışı" seçeneğini seçtiğimde
**When** form render edildiğinde
**Then** danışmanlık firması alanı görünür ve zorunlu olur (FR5)

**Given** "Kurum İçi" seçeneğini seçtiğimde
**When** form render edildiğinde
**Then** danışmanlık firması alanı gizlenir ve gerekmez (FR5)

**Given** zorunlu alanlar (ad, soyad) eksik
**When** formu gönderirsem
**Then** Zod validasyonu alan hatası gösterir, form gönderilmez

---

### Story 2.3: Eğitmene Skill Atama

Koordinatör olarak,
Bir eğitmene katalogdan skill atamak ve 10 üzerinden deneyim puanı girmek istiyorum,
Böylece eğitmenin yetkinlik profili eksiksiz ve aranabilir olsun.

**Acceptance Criteria:**

**Given** eğitmen profili düzenleme modunda (`/trainers/[id]/edit`)
**When** katalog dropdown'ından bir skill seçip puan (1-10) girersem
**Then** skill eğitmenin profiline eklenir ve skill listesinde görünür (FR11)

**Given** eğitmene atanmış bir skill var
**When** puanı güncellersem
**Then** yeni puan eskisinin yerini alır (FR12)

**Given** eğitmene atanmış bir skill var
**When** onu kaldırırsam
**Then** skill eğitmenin profilinden silinir (FR13)

**Given** 1-10 dışında bir puan girildiğinde
**When** kaydedersem
**Then** Zod validasyonu alan hatası gösterir

**Given** skill kataloğunda aktif ve pasif skill'ler var
**When** skill atama dropdown'unu açarsam
**Then** yalnızca aktif skill'ler (`isActive: true`) listelenir (FR15)

---

### Story 2.4: Eğitmen Düzenleme & Pasif Yönetimi

Koordinatör olarak,
Mevcut bir eğitmen profilini düzenlemek ve aktif/pasif durumunu kontrol etmek istiyorum,
Böylece eğitmen bilgileri güncel kalsın ve pasif eğitmenler yeni atamalarda görünmesin.

**Acceptance Criteria:**

**Given** `/trainers/[id]/edit` adresindeki düzenleme formu
**When** herhangi bir alanı güncelleyip kaydedersem
**Then** değişiklikler kalıcı olarak saklanır ve profil güncel değerleri gösterir (FR6)

**Given** aktif bir eğitmen
**When** onu pasife alırsam
**Then** `isActive: false` olur; eğitmen arama sonuçlarında ve atama dropdown'larında listelenmez (FR7, FR9)

**Given** pasif bir eğitmen
**When** onu yeniden aktive edersem
**Then** `isActive: true` olur; eğitmen arama ve atamalarda yeniden görünür (FR8)

**Given** pasif bir eğitmen
**When** doğrudan URL ile profiline erişirsem
**Then** profil görünür ve belirgin bir "Pasif" rozeti gösterilir

---

## Epic 3: Eğitim Yönetimi & Değerlendirme

Koordinatör wizard akışında eğitim oluşturup eğitmen atayabilir; çakışma uyarısı alabilir; eğitimi iptal edebilir veya tamamlandı işaretleyerek zorunlu puan girebilir. Ortalama puan ve bar grafik otomatik güncellenir.

### Story 3.1: Eğitim Tanımlama Wizard — Temel Bilgiler

Koordinatör olarak,
Yeni bir eğitimi konu, tarih, süre ve konum bilgileriyle rehberli bir wizard akışında tanımlamak istiyorum,
Böylece eğitim sisteme kaydedilsin ve eğitmen atamasına hazır olsun.

**Acceptance Criteria:**

**Given** `/trainings/new` adresindeki eğitim wizard'ı
**When** 1. adımı (konu, tarih, süre) ve 2. adımı (isteğe bağlı notlar) tamamlayıp ilerlesem
**Then** eğitim `status: "planned"` ile kaydedilir ve 3. adıma (eğitmen atama) geçilir (FR17)

**Given** zorunlu alanlar (konu, tarih) eksik
**When** sonraki adıma ilerlemeye çalışırsam
**Then** Zod validasyonu alan hatası gösterir ve ilerleme engellenir

**Given** eğitim "planned" durumunda kaydedilmişse
**When** eğitim listesine bakarsam
**Then** eğitim konu, tarih ve "Planlandı" durumuyla listelenir

---

### Story 3.2: Eğitmen Atama & Çakışma Kontrolü

Koordinatör olarak,
Eğitime bir veya birden fazla eğitmen atamak ve çakışma varsa uyarı almak istiyorum,
Böylece eğitmenleri çift rezervasyon yapmadan bilinçli atama kararları alabileyim.

**Acceptance Criteria:**

**Given** eğitim wizard'ının 3. adımı
**When** eğitmen seçersem
**Then** sistem o tarihte eğitmenin "planned" durumda başka eğitimi olup olmadığını sunucu tarafında sorgular (FR20)

**Given** seçilen eğitmenin o tarihte çakışması var
**When** atamaya çalışırsam
**Then** çakışan eğitimin detaylarıyla yumuşak uyarı gösterilir; atamaya devam edilebilir (FR20)

**Given** çakışma yok
**When** kaydedersem
**Then** eğitmen eğitime bağlanır (FR18)

**Given** birden fazla eğitmen ekledim
**When** kaydedersem
**Then** tüm eğitmenler co-trainer olarak eklenir (FR19) ve her biri ayrı ayrı çakışma kontrolünden geçer

**Given** çakışma uyarısı gösteriliyorsa
**When** kullanıcı uyarı mesajını gördüğünde
**Then** uyarı `warning` rengiyle (`#F59E0B`) gösterilir — kırmızı/engelleyici değil; metin çakışan eğitimin adını, tarihini ve konusunu içerir (UX Spec: Çakışma Soft Warning)

> **Cross-Epic Not:** Wizard adım 3 bu story ile tamamlanır (eğitmen seçimi + çakışma kontrolü). "Önerilen Eğitmenler" paneli bu story kapsamı **dışındadır**; Epic 4 Story 4.4 tarafından aynı ekrana eklenir. Epic 3 tamamlandığında wizard adım 3 yalnızca manuel seçim + çakışma uyarısı içerir.

---

### Story 3.3: Eğitim İptali

Koordinatör olarak,
Bir eğitimi iptal edip iptal notu eklemek istiyorum,
Böylece kayıt bağlamıyla birlikte korunsun ve eğitmenin takvimi serbest kalsın.

**Acceptance Criteria:**

**Given** "planned" durumunda bir eğitim
**When** iptal edip not girersem
**Then** eğitim `status: "cancelled"` olur, not kaydedilir ve kayıt silinmez (FR21, FR22)

**Given** eğitim iptal edilmişse
**When** liste veya takvimde görüntülenirse
**Then** aktif eğitimlerden ayırt edecek görsel farklılıkla gösterilir (FR22, FR39)

**Given** bir eğitim iptal edilmişse
**When** daha önce çakışan eğitmenin o tarihteki müsaitliğini kontrol edersem
**Then** çakışma bloğu kalkmıştır; eğitmen başka bir eğitime atanabilir (FR23)

**Given** iptal notu alanı boş bırakılmış
**When** iptali gönderirsem
**Then** validasyon hatası gösterilir — not zorunludur

---

### Story 3.4: Eğitim Tamamlama & Puan Girişi

Koordinatör olarak,
Bir eğitimi tamamlandı olarak işaretleyip eğitmen için değerlendirme puanı girmek istiyorum,
Böylece eğitim kaydı kapansın ve eğitmen performans verisi sisteme işlensin.

**Acceptance Criteria:**

**Given** "planned" durumunda bir eğitim
**When** "Tamamlandı" butonuna basıp puan girmeden onaylamaya çalışırsam
**Then** gönderme engellenir ve "Puan zorunludur" hatası gösterilir (FR25)

**Given** 1-10 arası puan girip onaylarsam
**When** eğitim tamamlandı işaretlendiğinde
**Then** `status: "completed"` olur, puan `Evaluation` koleksiyonuna kaydedilir ve eğitim listesine dönülür (FR24, FR40)

**Given** 1-10 dışında puan girilirse
**When** onaylamaya çalışırsam
**Then** Zod validasyonu alan hatası gösterir

**Given** eğitimin birden fazla co-trainer'ı var
**When** eğitimi tamamlarsam
**Then** tek bir puan girilir; bu puan eğitime atanmış TÜM eğitmenlere (primary + co-trainer) ayrı `Evaluation` kaydı olarak yazılır ve her eğitmenin ortalama puanı bu değerlendirmeden güncellenir

---

### Story 3.5: Aggregation API & Stats Hook

Koordinatör olarak,
Eğitmen değerlendirme verilerini hesaplayan bir API endpoint'i ve React Query hook'u oluşturmak istiyorum,
Böylece profil sayfası ve arama sonuçları bu aggregation verisini kullanabilsin.

**Acceptance Criteria:**

**Given** `GET /api/trainers/[id]/stats` endpoint'i çağrıldığında
**When** eğitmenin tamamlanmış değerlendirmeleri varsa
**Then** `{ averageScore: number, trainingCountByYear: { year: number, count: number }[] }` döner; averageScore virgülden sonra 1 basamak yuvarlanmış (FR41, FR42)

**Given** `GET /api/trainers/[id]/stats` endpoint'i çağrıldığında
**When** tamamlanmış değerlendirme yoksa
**Then** `{ averageScore: null, trainingCountByYear: [] }` döner (FR41, FR43)

**Given** `useTrainerStats(trainerId)` React Query hook'u tanımlanmış
**When** yeni bir `Evaluation` kaydedildiğinde
**Then** `['trainers', id, 'stats']` cache key'i invalidate edilir ve sonraki query güncel veriyi getirir

**Given** averageScore hesaplanırken
**When** tüm tamamlanan eğitim değerlendirmeleri aggregation ile işlenirse
**Then** hesaplama MongoDB aggregation pipeline ile sunucu tarafında yapılır; her profil açılışında N+1 sorgu oluşmaz (NFR3)

> **Not:** Bu story yalnızca backend API + React Query hook'u kapsar. Profil sayfasındaki görselleştirme (widget + bar grafik bileşeni) Epic 4 Story 4.3 tarafından bu API kullanılarak yapılır.

---

## Epic 4: Eğitmen Arama, Keşif & Profil

Koordinatör chip filtrelerle eğitmen arayabilir, CSV indirebilir, eğitmen profilini read-only veya edit modunda açabilir ve atama ekranında önerilen eğitmenleri görebilir.

### Story 4.1: Chip Filtreli Eğitmen Arama

Koordinatör olarak,
Ad/soyad, kurum içi/dışı, danışmanlık firması, skill ve minimum puan eşiği chip filtreleriyle eğitmen aramak istiyorum,
Böylece ihtiyacım olan eğitmeni hızlıca bulabileyim.

**Acceptance Criteria:**

**Given** `/search` sayfasında
**When** ad/soyad yazarsam
**Then** eşleşen aktif eğitmenler listelenir (pasif eğitmenler dahil edilmez, FR26)

**Given** skill chip filtresi eklediğimde
**When** uygulandığında
**Then** yalnızca o skill'e sahip eğitmenler gösterilir (FR26)

**Given** minimum puan chip filtresi eklediğimde
**When** uygulandığında
**Then** yalnızca ortalama puanı eşik değeri karşılayan eğitmenler gösterilir

**Given** birden fazla chip eklediğimde
**When** uygulandığında
**Then** sonuçlar TÜM aktif chip filtrelerini karşılar (AND mantığı, FR27)

**Given** bir chip kaldırıldığında
**When** uygulandığında
**Then** sonuçlar kalan filtreler için güncellenir (FR27)

**Given** sonuçlar listelenir
**When** her sonuca bakarsam
**Then** ad, soyad, kurum içi/dışı durumu ve ortalama puan gösterilir (FR28)

**Given** bir sonuç satırı genişletildiğinde
**When** ikincil görünüm açılır
**Then** eğitmenin skill listesi görüntülenir (FR29)

**Given** herhangi bir chip filtresi eklendiğinde veya kaldırıldığında
**When** filtre güncellenir
**Then** sonuçlar debounce olmadan anında güncellenir; sayfa yenilenmez (UX Spec: Chip Filtreler)

**Given** arama sonuçlarında eğitmenler listeleniyor
**When** her eğitmen kartı gösterildiğinde
**Then** kart şunları içerir: ad + soyad, ortalama puan (tamamlanan eğitim yoksa "—"), kurum içi/dışı badge; profil sayfasına girmeden atama kararı verilebilecek düzeyde bilgi (UX Spec: "Tek Bakışta Karar")

**Given** tüm aktif chip filtreler uygulandığında hiçbir eğitmen eşleşmezse
**When** sonuç listesi render edildiğinde
**Then** "Kriterlere uyan aktif eğitmen bulunamadı" mesajı ve "Filtreleri Temizle" butonu gösterilir (UX Spec: Anti-pattern — boş durum sessizliği)

---

### Story 4.2: CSV Export

Koordinatör olarak,
Mevcut eğitmen arama sonuçlarını CSV olarak indirmek istiyorum,
Böylece veriyi harici araçlarda kullanabileyim veya paylaşabileyim.

**Acceptance Criteria:**

**Given** arama sonuçları görüntülenmiş (filtreli veya filtresiz)
**When** "CSV İndir" butonuna tıklarsam
**Then** şu sütunlarla CSV dosyası indirilir: ad, soyad, kurum içi/dışı, danışmanlık firması, ortalama puan, skill listesi (FR30)

**Given** sonuç bulunmadığında
**When** "CSV İndir" butonuna tıklarsam
**Then** buton devre dışıdır veya yalnızca başlık satırı içeren boş CSV indirilir

**Given** filtreler aktifken
**When** CSV export edilir
**Then** yalnızca filtrelenmiş sonuçlar dosyaya dahil edilir

---

### Story 4.3: Eğitmen Profil Sayfası

Koordinatör olarak,
Eğitmenin eksiksiz profilini read-only modda görüntülemek ve gerektiğinde edit moduna geçmek istiyorum,
Böylece eğitmen bilgilerini detaylı inceleyip güncel tutabileyim.

**Acceptance Criteria:**

**Given** arama sonuçlarından veya eğitmen listesinden eğitmen adına tıkladığımda
**When** `/trainers/[id]` profil sayfası yüklenir
**Then** ad, soyad, kurum içi/dışı, danışmanlık firması, özgeçmiş, puanlı skill listesi görünür (FR31)

**Given** `GET /api/trainers/[id]/stats` endpoint'i (Story 3.5 tarafından oluşturulmuş) çağrıldığında
**When** profil sayfası yüklendiğinde
**Then** ortalama puan widget'ı (tek basamak ondalık, boş = "—") ve yıllık eğitim bar grafiği profil sayfasının üst kısmında görüntülenir (FR42, FR43)

> **Not:** Aggregation verisi Story 3.5'te oluşturulan `useTrainerStats` hook'u üzerinden gelir.

**Given** profil sayfasındayken
**When** "Düzenle" butonuna tıklarsam
**Then** sayfa edit moduna geçer; tüm alanlar düzenlenebilir olur (FR32)

**Given** edit modunda değişiklikleri kaydedersem
**When** kaydetme başarılı olur
**Then** read-only görünüme geri dönülür; güncel veriler gösterilir

**Given** pasif bir eğitmen
**When** profilini görürsem
**Then** belirgin "Pasif" durum rozeti gösterilir

---

### Story 4.4: Önerilen Eğitmenler

Koordinatör olarak,
Eğitim konusu için uygun ve o tarihte müsait eğitmenlerin otomatik olarak önerilmesini istiyorum,
Böylece manuel arama yapmadan en uygun eğitmeni hızlıca atayabileyim.

> **Cross-Epic Not:** Bu story, Epic 3 Story 3.2 ile oluşturulan wizard adım 3 ekranına "Önerilen Eğitmenler" paneli ekler. Uygulama sırası: önce Story 3.2 (manuel seçim + çakışma kontrolü), sonra bu story (önerilen panel eklenir).

**Acceptance Criteria:**

**Given** eğitim wizard'ının 3. adımı (konu ve tarih girilmiş)
**When** atama adımı yüklenir
**Then** sistem; eğitim konusuna skill olarak sahip, o tarihte müsait, aktif eğitmenleri ortalama puan azalan sırayla listeler (FR33)

**Given** önerilen eğitmenler listelenmiş
**When** birini seçersem
**Then** eğitmen atama alanına ön doldurulur

**Given** kriterleri karşılayan eğitmen yoksa
**When** öneri paneli yüklenir
**Then** "Bu konu için uygun eğitmen bulunamadı" mesajı gösterilir

**Given** öneri sorgusu çalıştırıldığında
**When** sonuç döndüğünde
**Then** yanıt süresi 1,5 saniyenin altındadır (NFR2)

---

## Epic 5: Takvim & Dashboard

Koordinatör eğitimlerini takvim, liste ve kart görünümlerinde izleyebilir; kendi veya tüm akademi eğitimleri arasında geçiş yapabilir; dashboard'da haftalık özet ve iptal renk kodlamasını görebilir.

### Story 5.1: Dashboard & Haftalık Özet

Koordinatör olarak,
Dashboard açıldığında bu haftaki ve yaklaşan eğitimlerin özetini görmek istiyorum,
Böylece anlık bir genel bakışa sahip olayım.

**Acceptance Criteria:**

**Given** `/dashboard` adresine gittiğimde
**When** sayfa yüklenir
**Then** mevcut haftanın eğitimleri gruplu veya vurgulu olarak gösterilir (FR38)

**Given** yaklaşan eğitimler mevcut
**When** dashboard yüklenir
**Then** sonraki 30 gün içindeki eğitimler konu, tarih ve durumuyla listelenir (30 gün sabit iş kuralı)

**Given** bu hafta eğitim yoksa
**When** dashboard yüklenir
**Then** haftalık bölümde boş durum mesajı gösterilir

---

### Story 5.2: Takvim, Liste & Kart Görünümleri

Koordinatör olarak,
Eğitimlerimi takvim, liste ve kart görünümleri arasında geçiş yaparak izlemek istiyorum,
Böylece takvimi o an için en uygun formatta görebileyim.

**Acceptance Criteria:**

**Given** dashboard'dayım
**When** "Takvim" görünümünü seçersem
**Then** eğitimler aylık takvim ızgarasında gösterilir (FR34)

**Given** "Liste" görünümünü seçersem
**When** render edildiğinde
**Then** eğitimler konu, tarih, eğitmen adları ve durumuyla kronolojik liste olarak gösterilir (FR35)

**Given** "Kart" görünümünü seçersem
**When** render edildiğinde
**Then** eğitimler temel bilgilerle kart olarak gösterilir (FR36)

**Given** görünümler arasında geçiş yapıldığında
**When** görünüm seçilir
**Then** tam sayfa yenileme olmadan güncellenir (SPA davranışı, NFR4)

**Given** eğitimler herhangi bir görünümde (takvim/liste/kart) listeleniyor
**When** her eğitimin durumu gösterildiğinde
**Then** durum badge rengi şöyle belirlenir: `planned` → mavi (`#3B82F6`), `completed` → yeşil/success (`#22C55E`), `cancelled` → kırmızı/destructive (`#EF4444`) (UX Spec: Status Color Coding)

---

### Story 5.3: Görünüm Filtreleri & İptal Renk Kodlaması

Koordinatör olarak,
Yalnızca kendi eğitimlerim ile tüm akademi eğitimleri arasında geçiş yapmak ve iptal edilen eğitimleri görsel olarak ayırt etmek istiyorum,
Böylece ilgili veriye odaklanabileyim ve iptal durumlarını hızlıca fark edebileyim.

**Acceptance Criteria:**

**Given** herhangi bir görünümdeyim (takvim/liste/kart)
**When** "Tüm Akademi" filtresine geçersem
**Then** tüm koordinatörlerin eğitimleri gösterilir (FR37)

**Given** "Benim Eğitimlerim" filtresine geçersem
**When** uygulandığında
**Then** yalnızca giriş yapmış koordinatörün oluşturduğu eğitimler gösterilir (FR37)

**Given** "cancelled" durumunda bir eğitim var
**When** herhangi bir görünümde gösterildiğinde
**Then** `destructive` rengiyle (`#EF4444`) ve üstü çizili metin veya iptal ikonu ile aktif eğitimlerden belirgin biçimde ayrışır (FR39, UX Spec: Status Color Coding)

**Given** filtre değiştirildiğinde
**When** sayfadan ayrılıp geri dönüldüğünde
**Then** en son seçilen filtre hatırlanır (oturum seviyesi state)
