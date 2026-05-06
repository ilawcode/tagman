---
stepsCompleted: [1, 2, 3, 4, 5, 6]
status: complete
inputDocuments: [prd.md, architecture.md, epics.md, ux-design-specification.md]
---

# Implementation Readiness Assessment Report

**Date:** 2026-05-06
**Project:** tagman (Akademi Portalı)

## Document Inventory

| Doküman | Dosya | Durum |
|---------|-------|-------|
| PRD | `prd.md` | ✅ Tam |
| Architecture | `architecture.md` | ✅ Tam |
| Epics & Stories | `epics.md` | ✅ Tam |
| UX Design | `ux-design-specification.md` | ✅ Mevcut (Epic'lere henüz dahil edilmedi) |

## PRD Analysis

### Functional Requirements

**Kimlik Yönetimi**
- FR1: Koordinatör sisteme kayıt olabilir
- FR2: Koordinatör sisteme giriş yapabilir
- FR3: Koordinatör oturumunu sonlandırabilir

**Eğitmen Yönetimi**
- FR4: Koordinatör yeni eğitmen kaydı oluşturabilir (ad, soyad, kurum içi/dışı, özgeçmiş)
- FR5: Koordinatör kurum dışı eğitmen için danışmanlık firması bilgisi girebilir
- FR6: Koordinatör mevcut eğitmen profilini düzenleyebilir
- FR7: Koordinatör eğitmeni pasife alabilir (soft delete)
- FR8: Koordinatör pasif eğitmeni yeniden aktive edebilir
- FR9: Sistem pasif eğitmeni yeni atamalarda ve arama sonuçlarında listelemez

**Skill Kataloğu**
- FR10: Koordinatör merkezi skill kataloğuna yeni skill ekleyebilir
- FR11: Koordinatör bir eğitmene katalogdan skill atayabilir ve 10 üzerinden deneyim puanı girebilir
- FR12: Koordinatör bir eğitmenin mevcut skill puanını güncelleyebilir
- FR13: Koordinatör eğitmene atanmış bir skill'i profilden kaldırabilir
- FR14: Koordinatör katalogdaki bir skill'i pasife alabilir
- FR15: Sistem pasif skill'i yeni atamalarda göstermez; mevcut kayıtlar korunur
- FR16: Sistem her skill'in sisteme kayıt tarihini kaydeder ve görüntüler

**Eğitim Yönetimi**
- FR17: Koordinatör tek wizard akışında eğitim tanımlayabilir ve eğitmen atayabilir
- FR18: Koordinatör bir eğitime tek eğitmen atayabilir
- FR19: Koordinatör bir eğitime birden fazla eğitmen (co-trainer) atayabilir
- FR20: Sistem atama sırasında eğitmenin (ana ve co-trainer) o günkü doluluk durumunu gösterir ve çakışma varsa uyarır
- FR21: Koordinatör eğitimi iptal edebilir ve iptal notu ekleyebilir
- FR22: Sistem iptal edilen eğitimi silmez; takvimde farklı renk/ikon ve notla gösterir
- FR23: Sistem iptal edilen eğitime atanmış eğitmenlerin o günkü çakışma bloğunu kaldırır
- FR24: Koordinatör eğitimi tamamlandı olarak işaretleyebilir
- FR25: Sistem eğitimi tamamlandı olarak işaretlerken puan girişini zorunlu kılar

**Eğitmen Arama & Keşif**
- FR26: Koordinatör eğitmenleri ad/soyad, kurum içi/dışı, danışmanlık firması, skill ve minimum puan eşiği kriterlerine göre filtreleyebilir
- FR27: Koordinatör arama filtrelerini chip olarak ekleyip kaldırabilir
- FR28: Sistem arama sonuçlarında eğitmenin adı, soyadı, kurum içi/dışı durumu ve ortalama puanını ana görünümde gösterir
- FR29: Koordinatör arama sonuçlarında ikincil görünüm olarak eğitmenin skill listesini görebilir
- FR30: Koordinatör eğitmen arama sonuçlarını CSV olarak indirebilir
- FR31: Koordinatör eğitmen profilini read-only modda görüntüleyebilir
- FR32: Koordinatör eğitmen profilini edit modunda düzenleyebilir
- FR33: Sistem atama ekranında ilgili eğitim konusunda en yüksek puanlı ve o gün müsait eğitmenleri önerir

**Takvim & Dashboard**
- FR34: Koordinatör eğitimlerini takvim görünümünde görebilir
- FR35: Koordinatör eğitimlerini liste görünümünde görebilir
- FR36: Koordinatör eğitimlerini kart görünümünde görebilir
- FR37: Koordinatör yalnızca kendi tanımladığı eğitimleri veya tüm akademi eğitimlerini görüntüleme arasında geçiş yapabilir
- FR38: Dashboard açılışında bu haftaki ve yaklaşan eğitimlerin özeti görünür
- FR39: Sistem takvimde iptal edilen eğitimleri farklı renk/ikon ile gösterir

**Değerlendirme & Puanlama**
- FR40: Koordinatör tamamlanan eğitim için eğitmene 10 üzerinden puan girebilir
- FR41: Sistem eğitmenin ortalama puanını tamamlanan tüm eğitimlerden otomatik hesaplar ve günceller
- FR42: Eğitmen profil sayfasında yıllık eğitim sayısı bar grafik olarak görüntülenir
- FR43: Eğitmenin ortalama puanı arama sonuçlarında ve profil sayfasında görünür

**Toplam FR Sayısı: 43**

### Non-Functional Requirements

**Performans**
- NFR1: Eğitmen arama sorguları 1 saniye içinde sonuç döndürmelidir
- NFR2: Önerilen Eğitmenler sorgusu (puan + müsaitlik aggregation) 1,5 saniye içinde tamamlanmalıdır
- NFR3: Eğitmen profil sayfası bar grafik ve ortalama puan verileri 2 saniye içinde yüklenmelidir
- NFR4: SPA sayfa geçişleri 300ms altında tamamlanmalıdır

**Güvenlik**
- NFR5: Tüm API istekleri kimlik doğrulaması gerektirmelidir; doğrulanmamış istekler reddedilmelidir
- NFR6: Koordinatör şifreleri bcrypt veya eşdeğeriyle hash'lenerek saklanmalıdır
- NFR7: JWT token'ları süre sınırına tabi olmalı ve oturum sonlandırmada geçersiz kılınmalıdır
- NFR8: Tüm istemci-sunucu iletişimi HTTPS üzerinden yapılmalıdır
- NFR9: Eğitmen kişisel verileri yalnızca oturum açmış koordinatörlere erişilebilir olmalıdır

**Toplam NFR Sayısı: 9**

### Additional Requirements

**Teknik Kısıtlar (PRD'den):**
- Soft delete zorunluluğu: Eğitmen ve skill kayıtları `isActive` flag ile pasife alınır; fiziksel silme yapılmaz
- Çakışma kontrolü: Atama kaydedilmeden önce sunucu tarafında sorgu; soft warning (bloklama yok)
- Platform: Yalnızca masaüstü tarayıcı (Chrome, Firefox, Edge, Safari son sürüm)
- Erişilebilirlik: Standart hedeflenmez; temel HTML semantiği yeterlidir
- SEO: Gerekmiyor (dahili araç)
- Gerçek zamanlılık: Gerekmiyor

**Mimari Kısıtlar:**
- Next.js 15 App Router, SPA davranışı
- MongoDB + Mongoose
- JWT tabanlı kimlik doğrulama (koordinatör giriş/kayıt)

**Kapsam Dışı (Post-MVP):**
- Eğitmen profiline konu dağılımı pasta/donut grafik
- Gelişmiş raporlama ve analitik
- Diğer kurumsal sistemlerle (İK, takvim uygulamaları) entegrasyon

### PRD Completeness Assessment

PRD kapsamlı ve açıktır. 43 FR ve 9 NFR net numaralandırma ile tanımlanmıştır. Kullanıcı yolculukları gereksinimleri somutlaştırmaktadır. Tek eksik nokta: PRD'de UI/UX detayları (renk sistemi, navigasyon yapısı, bileşen tasarımı) yer almamaktadır — bunlar ayrı bir `ux-design-specification.md` dosyasında bulunmaktadır. Bu dosyanın epic/story'lere aktarılıp aktarılmadığı Epic Coverage Validation adımında kontrol edilecektir.

## Epic Coverage Validation

### Coverage Matrix

| FR | PRD Gereksinimi | Epic Coverage | Durum |
|----|----------------|---------------|-------|
| FR1 | Koordinatör sisteme kayıt olabilir | Epic 1 / Story 1.2 | ✅ Kapsandı |
| FR2 | Koordinatör sisteme giriş yapabilir | Epic 1 / Story 1.3 | ✅ Kapsandı |
| FR3 | Koordinatör oturumunu sonlandırabilir | Epic 1 / Story 1.3 | ✅ Kapsandı |
| FR4 | Koordinatör yeni eğitmen kaydı oluşturabilir | Epic 2 / Story 2.2 | ✅ Kapsandı |
| FR5 | Koordinatör kurum dışı için danışmanlık firması girebilir | Epic 2 / Story 2.2 | ✅ Kapsandı |
| FR6 | Koordinatör mevcut eğitmen profilini düzenleyebilir | Epic 2 / Story 2.4 | ✅ Kapsandı |
| FR7 | Koordinatör eğitmeni pasife alabilir (soft delete) | Epic 2 / Story 2.4 | ✅ Kapsandı |
| FR8 | Koordinatör pasif eğitmeni yeniden aktive edebilir | Epic 2 / Story 2.4 | ✅ Kapsandı |
| FR9 | Sistem pasif eğitmeni yeni atamalarda/aramada listelemez | Epic 2 / Story 2.4 | ✅ Kapsandı |
| FR10 | Koordinatör skill kataloğuna yeni skill ekleyebilir | Epic 2 / Story 2.1 | ✅ Kapsandı |
| FR11 | Koordinatör eğitmene skill atayabilir ve puan girebilir | Epic 2 / Story 2.3 | ✅ Kapsandı |
| FR12 | Koordinatör eğitmenin mevcut skill puanını güncelleyebilir | Epic 2 / Story 2.3 | ✅ Kapsandı |
| FR13 | Koordinatör eğitmenden skill kaldırabilir | Epic 2 / Story 2.3 | ✅ Kapsandı |
| FR14 | Koordinatör katalogdaki skill'i pasife alabilir | Epic 2 / Story 2.1 | ✅ Kapsandı |
| FR15 | Sistem pasif skill'i yeni atamalarda göstermez | Epic 2 / Story 2.1, 2.3 | ✅ Kapsandı |
| FR16 | Sistem skill'in sisteme kayıt tarihini kaydeder | Epic 2 / Story 2.1 | ✅ Kapsandı |
| FR17 | Koordinatör wizard akışında eğitim tanımlayabilir ve atayabilir | Epic 3 / Story 3.1, 3.2 | ✅ Kapsandı |
| FR18 | Koordinatör eğitime tek eğitmen atayabilir | Epic 3 / Story 3.2 | ✅ Kapsandı |
| FR19 | Koordinatör eğitime co-trainer atayabilir | Epic 3 / Story 3.2 | ✅ Kapsandı |
| FR20 | Sistem çakışma durumunu gösterir ve uyarır (soft warning) | Epic 3 / Story 3.2 | ✅ Kapsandı |
| FR21 | Koordinatör eğitimi iptal edebilir ve not ekleyebilir | Epic 3 / Story 3.3 | ✅ Kapsandı |
| FR22 | Sistem iptal edilen eğitimi silmez, farklı renk/ikonla gösterir | Epic 3 / Story 3.3 | ✅ Kapsandı |
| FR23 | Sistem iptal sonrası çakışma bloğunu kaldırır | Epic 3 / Story 3.3 | ✅ Kapsandı |
| FR24 | Koordinatör eğitimi tamamlandı olarak işaretleyebilir | Epic 3 / Story 3.4 | ✅ Kapsandı |
| FR25 | Sistem tamamlama sırasında puan girişini zorunlu kılar | Epic 3 / Story 3.4 | ✅ Kapsandı |
| FR26 | Koordinatör çok kriterli eğitmen filtreleyebilir | Epic 4 / Story 4.1 | ✅ Kapsandı |
| FR27 | Koordinatör arama filtrelerini chip olarak ekleyip kaldırabilir | Epic 4 / Story 4.1 | ✅ Kapsandı |
| FR28 | Sistem arama sonuçlarında ad/kurum/ortalama puan gösterir | Epic 4 / Story 4.1 | ✅ Kapsandı |
| FR29 | Koordinatör ikincil görünümde skill listesini görebilir | Epic 4 / Story 4.1 | ✅ Kapsandı |
| FR30 | Koordinatör arama sonuçlarını CSV olarak indirebilir | Epic 4 / Story 4.2 | ✅ Kapsandı |
| FR31 | Koordinatör eğitmen profilini read-only modda görüntüleyebilir | Epic 4 / Story 4.3 | ✅ Kapsandı |
| FR32 | Koordinatör eğitmen profilini edit modunda düzenleyebilir | Epic 4 / Story 4.3 | ✅ Kapsandı |
| FR33 | Sistem atama ekranında önerilen eğitmenleri listeler | Epic 4 / Story 4.4 | ✅ Kapsandı |
| FR34 | Koordinatör eğitimlerini takvim görünümünde görebilir | Epic 5 / Story 5.2 | ✅ Kapsandı |
| FR35 | Koordinatör eğitimlerini liste görünümünde görebilir | Epic 5 / Story 5.2 | ✅ Kapsandı |
| FR36 | Koordinatör eğitimlerini kart görünümünde görebilir | Epic 5 / Story 5.2 | ✅ Kapsandı |
| FR37 | Koordinatör kendi/tüm akademi eğitimleri arasında geçiş yapabilir | Epic 5 / Story 5.3 | ✅ Kapsandı |
| FR38 | Dashboard açılışında haftalık özet görünür | Epic 5 / Story 5.1 | ✅ Kapsandı |
| FR39 | Sistem takvimde iptal edilen eğitimleri farklı renk/ikonla gösterir | Epic 5 / Story 5.3 | ✅ Kapsandı |
| FR40 | Koordinatör tamamlanan eğitim için 10 üzerinden puan girebilir | Epic 3 / Story 3.4 | ✅ Kapsandı |
| FR41 | Sistem ortalama puanı otomatik hesaplar ve günceller | Epic 3 / Story 3.5 | ✅ Kapsandı |
| FR42 | Eğitmen profilinde yıllık eğitim sayısı bar grafik görüntülenir | Epic 3 / Story 3.5 | ✅ Kapsandı |
| FR43 | Eğitmenin ortalama puanı arama sonuçlarında ve profilde görünür | Epic 3 / Story 3.5 | ✅ Kapsandı |

### Missing Requirements

Tüm 43 FR epic'lerde kapsanmıştır. Ancak kritik bir gap tespit edildi:

#### ⚠️ KRİTİK GAP: UX Design Gereksinimleri Epic'lere Dahil Edilmemiş

`ux-design-specification.md` dosyası mevcut ve tamamlanmış durumda olmasına rağmen, `epics.md` içinde şu ifade yer almaktadır:

> **"UX Design dokümanı mevcut değil — gereksinim yok."**

Bu hata, epics oluşturma aşamasında UX spec'in göz ardı edilmesinden kaynaklanmıştır. UX spec'te yer alıp hiçbir epic/story'de bulunmayan gereksinimler:

| UX Gereksinimi | Etki Alanı | Kapsandığı Epic |
|----------------|-----------|-----------------|
| Turkcell marka renkleri: #FFD100 (sarı), #1A1A1A (koyu gri) | Tüm UI bileşenleri | ❌ YOK |
| Yalnızca açık tema (light theme only) | Tailwind config, global CSS | ❌ YOK |
| Linear-style sidebar navigasyon | Layout bileşeni | ❌ YOK |
| Status renk kodlaması: planned=mavi, completed=yeşil, cancelled=kırmızı/gri | Dashboard, takvim, liste, kart görünümleri | ❌ YOK |
| Chip filtre UX: anlık güncelleme (instant update, debounce yok) | Story 4.1 | ❌ YOK |
| Eğitmen "tek bakışta karar" kart tasarımı | Arama ve önerilen eğitmenler görünümü | ❌ YOK |

### Coverage Statistics

- **Toplam PRD FR sayısı:** 43
- **Epic'lerde kapsanan FR sayısı:** 43
- **FR kapsama yüzdesi:** %100
- **Eksik FR:** 0
- **Kapsanmayan UX gereksinimleri:** 6 (kritik — kurumsal kimlik ve kullanılabilirlik etkisi var)

## UX Alignment Assessment

### UX Document Status

✅ **Mevcut** — `ux-design-specification.md` tamamlanmış ve ayrıntılıdır (stepsCompleted: [1,2,3,4,5,6,7,8])

### UX ↔ PRD Alignment

| UX Gereksinimi | PRD Durumu | Notlar |
|----------------|-----------|--------|
| Chip filtreli eğitmen arama | ✅ FR26, FR27 | UX anlık güncelleme gerektirir — PRD'de belirtilmemiş |
| Önerilen eğitmenler (wizard adım 3) | ✅ FR33 | UX 4 adımlı wizard belirtmiş; PRD 2 adım ima ediyor |
| Takvim/Liste/Kart görünümleri | ✅ FR34-FR36 | Tam uyumlu |
| İptal renk kodlaması | ✅ FR22, FR39 | UX kırmızı renk belirtmiş; PRD yalnızca "farklı renk/ikon" diyor |
| Tamamlama = puan zorunlu | ✅ FR25, FR40 | Tam uyumlu |
| Turkcell marka renkleri (#FFD100, #1A1A1A) | ❌ PRD'de yok | UX-spesifik; PRD kurumsal renk sisteminden söz etmiyor |
| Inter tipografi | ❌ PRD'de yok | UX-spesifik |
| shadcn/ui bileşen kütüphanesi | ❌ PRD'de yok | UX-spesifik; mimari karar |
| Sol sidebar navigasyon (Linear-style) | ❌ PRD'de yok | UX-spesifik navigasyon yapısı |
| Durum renkleri: planlandı=mavi, tamamlandı=yeşil, iptal=kırmızı | ❌ PRD'de yok | UX-spesifik renk tanımı |

**Sonuç:** PRD ↔ UX çatışması yok. UX spec PRD'yi detaylandırıp somutlaştırıyor, çelişen bir gereksinim içermiyor.

### UX ↔ Architecture Alignment

| UX Gereksinimi | Architecture Durumu | Notlar |
|----------------|---------------------|--------|
| Tailwind CSS | ✅ Kurulumda var | `create-next-app` starter ile dahil |
| SPA sayfa geçişleri | ✅ Mimari kararı | Next.js App Router ile destekleniyor |
| React Query server state | ✅ Mimari kararı | Anlık chip filtre güncellemesi ile uyumlu |
| httpOnly JWT | ✅ Mimari kararı | UX güvenilirlik hedefiyle uyumlu |
| Turkcell renk tokenları (globals.css) | ❌ Mimari belgede yok | Tailwind config'de `primary: #FFD100` tanımı eksik |
| **shadcn/ui kurulumu** | ❌ **Mimari belgede yok** | **Kritik — tüm UI bileşen altyapısı bu kütüphaneye bağlı** |
| Inter font kurulumu | ❌ Mimari belgede yok | `next/font` ile Google Fonts entegrasyonu belgelenmemiş |
| Sol sidebar layout bileşeni | ❌ Mimari belgede yok | `src/components/layout/Sidebar.tsx` yapısı tanımlanmamış |
| Durum renk sistemi (badge/etiket) | ❌ Mimari belgede yok | `success`, `warning`, `destructive` Tailwind token tanımları eksik |

**Kritik Uyumsuzluk:** `shadcn/ui` UX spec'te temel bileşen kütüphanesi olarak seçilmiş ancak architecture.md'de hiç geçmiyor. Bu, dev agent'ın hangi UI kütüphanesini kullanacağını bilmemesine yol açar.

### Warnings

⚠️ **UYARI 1 (Kritik):** `shadcn/ui` architecture.md'e eklenmeli — bileşen kütüphanesi seçimi mimari bir karardır, story düzeyinde değil.

⚠️ **UYARI 2 (Kritik):** Epic 1 Story 1.1 (Proje Başlatma) `shadcn/ui init` ve Tailwind design token kurulumunu kapsamamaktadır. Bu kurulum yapılmadan diğer tüm UI story'leri başlayamaz.

⚠️ **UYARI 3 (Önemli):** Tüm story'lerde renk, tipografi ve bileşen seçimleri belirsizdir — geliştirici kendi kararını verecek. UX spec varlığı bu belirsizliği gidermektedir ancak dev agent'a aktarılması için story'lere referans eklenmesi gerekir.

⚠️ **UYARI 4 (Orta):** Story 5.3'te iptal eğitimleri için "kırmızı renk" belirtilmiş ancak tam renk token değeri (`#EF4444` / `destructive`) story'de yer almıyor.

## Epic Quality Review

### Epic Structure Validation

#### Kullanıcı Değeri Odağı

| Epic | Başlık | Değerlendirme |
|------|--------|---------------|
| Epic 1 | Proje Altyapısı & Kimlik Yönetimi | ⚠️ "Proje Altyapısı" teknik milestone — ancak greenfield için kabul edilebilir; Story 1.2 ve 1.3 net kullanıcı değeri taşıyor |
| Epic 2 | Eğitmen & Skill Yönetimi | ✅ Net kullanıcı değeri |
| Epic 3 | Eğitim Yönetimi & Değerlendirme | ✅ Net kullanıcı değeri |
| Epic 4 | Eğitmen Arama, Keşif & Profil | ✅ Net kullanıcı değeri |
| Epic 5 | Takvim & Dashboard | ✅ Net kullanıcı değeri |

#### Epic Bağımsızlık Analizi

| Epic | Bağımlılık | Durum |
|------|-----------|-------|
| Epic 1 | Hiçbir epic'e bağımlı değil | ✅ |
| Epic 2 | Epic 1 (auth, DB bağlantısı) | ✅ |
| Epic 3 | Epic 1 & 2 (eğitmen + skill verisi) | ✅ |
| Epic 4 | Epic 1, 2, 3 (profil avg puan + bar grafik verisi) | ✅ |
| Epic 5 | Epic 1, 3 (eğitim verisi) | ✅ |

### 🔴 Critical Violations

**YOK** — Kritik ihlal tespit edilmedi.

### 🟠 Major Issues

**M1: Story 3.5 ↔ Story 4.3 Kapsam Çakışması — Eğitmen Profil Sayfası**

Story 3.5 AC'si: *"eğitmenin profil sayfasını görüntülersem → ortalama puan ve bar grafik görüntülenir"*
Story 4.3 AC'si: *"profil sayfası yüklenir → ortalama puan ve bar grafik görünür"*

İki farklı story aynı sayfaya aynı bileşeni (avg puan + bar grafik) yazıyor. Dev agent için belirsizlik:
- Story 3.5 (Epic 3): Aggregation API + profil sayfasına widget ekle
- Story 4.3 (Epic 4): Profil sayfasını tamamen yeniden yaz — Story 3.5'in yazdığını silip mi yoksa koruyup mu yapacak?

**Risk:** Story 4.3, Story 3.5 tarafından oluşturulan bileşenlerin üzerine yazabilir.

**Öneri:** Story 3.5'i yeniden tanımla — yalnızca backend aggregation endpoint (API + React Query hook); profil sayfasındaki display Story 4.3'e bırak. Story 4.3 "avg puan ve bar grafik bileşenini Story 3.5 API'sini kullanarak profil sayfasına entegre eder" şeklinde güncellensin.

---

**M2: Story 1.1'de shadcn/ui Kurulumu Eksik**

UX spec `shadcn/ui`'ı temel bileşen kütüphanesi olarak belirlemiş. Story 1.1 yalnızca `create-next-app@latest` kurulumunu, MongoDB singleton'ı ve API wrapper'ı kapsıyor. `shadcn/ui init`, Tailwind renk token'ları ve `Inter` font kurulumu hiçbir story'de yok.

**Risk:** Dev agent tüm UI story'lerini başlatmadan önce hangi design system'i kullanacağını bilmiyor.

**Öneri:** Story 1.1'e şu AC'leri ekle:
- `npx shadcn-ui@latest init` çalıştırılır
- `tailwind.config.ts`'e Turkcell token'ları eklenir: `primary: '#FFD100'`, `primary-foreground: '#1A1A1A'`, `background: '#F5F5F5'`, durum renkleri
- `next/font` ile `Inter` yüklenir ve `globals.css`'e uygulanır
- Sol sidebar layout bileşeni (`src/components/layout/`) iskelet olarak oluşturulur

---

**M3: epics.md'de Yanlış Beyan — "UX Design dokümanı mevcut değil"**

Epics oluşturulurken UX spec'in varlığı fark edilmemiş; sonuç olarak şu kritik gereksinimler hiçbir story'ye yansımamıştır:
- Turkcell renk sistemi uygulaması
- shadcn/ui kurulum ve konfigürasyonu
- Sidebar navigasyon bileşeni
- Status badge renk kodlaması (planned=mavi, completed=yeşil, cancelled=kırmızı)
- Chip filtre UX davranışı (instant update = debounce yok)
- Eğitmen sonuç kartı "tek bakışta karar" tasarımı

**Risk:** Dev agent UX spec'i bilmeden geliştirir; teslimatta kurumsal kimlik ve kullanılabilirlik hedefleri karşılanmaz.

**Öneri:** Story 1.1'e design system kurulumu ekle (M2). Diğer story'lere UX spec referansı ekle (ör. "UX spec §4 Color System'e göre").

---

**M4: Story 4.4 ↔ Story 3.2 — Wizard Adım 3 UI Paylaşımı**

Story 3.2 wizard step 3'ü (eğitmen atama + çakışma kontrolü) uygular.
Story 4.4 aynı wizard step 3 ekranına "Önerilen Eğitmenler" paneli ekler.

Epic 3 tamamlandığında wizard step 3 fonksiyonel ama eksik görünür (önerilen panel yok). Epic 4 tamamlandıktan sonra tam özellikli olur.

**Risk:** Bu tasarım niyeti story'lerde belirtilmemiş — dev agent Epic 3'te wizard'ı "tamamlanmış" mı yoksa "eksik" mi kabul edeceğini bilmiyor.

**Öneri:** Story 3.2'ye şu notu ekle: *"Wizard adım 3, önerilen eğitmenler paneli olmadan; yalnızca manual seçim + çakışma uyarısı içerir. Önerilen panel Epic 4 Story 4.4'te eklenir."* Story 4.4'e de: *"Epic 3 Story 3.2 ile oluşturulan wizard adım 3 ekranına önerilen eğitmenler paneli eklenir."*

### 🟡 Minor Concerns

**Mi1: Story 3.1 — "Konum/Notlar" Alanı PRD'de Yok**

Story 3.1 "2. adımı (konum/notlar)" olarak adlandırıyor. PRD'de eğitim için tanımlanan alanlar: konu, tarih, süre. "Konum" alanı ne PRD'de ne de UX spec'te geçiyor. Muhtemelen bir spec hatası ya da geliştiricinin ekstra alan eklemesine yol açabilecek belirsiz bir ifade.

**Öneri:** "Konum/notlar" adımını kaldır veya PRD'ye "konum" alanını açıkça ekle.

---

**Mi2: Story 4.1 — Boş Durum (Empty State) AC Eksik**

Tüm filtreler uygulandığında sonuç gelmezse ne olur? UX spec bu anti-pattern'i açıkça uyarıyor: *"Filtre sonucu boş geldiğinde neden boş olduğu ve ne yapılacağı açıkça söylenmeli."* Story 4.1'de bu senaryo için AC yok.

**Öneri:** AC ekle: *"Given tüm chip filtreler uygulandığında hiçbir eğitmen eşleşmezse → 'Kriterlere uyan aktif eğitmen bulunamadı' mesajı ve filtreleri temizle butonu gösterilir."*

---

**Mi3: Story 2.1 — Duplicate Skill Adı Validasyon AC Eksik**

Zaten var olan bir isimle skill eklenirse ne olur? Story 2.1'de bu hata durumu kapsanmıyor.

**Öneri:** AC ekle: *"Given katalogda aynı isimde aktif bir skill zaten varsa → 'Bu skill adı zaten mevcut' hata mesajı gösterilir."*

---

**Mi4: Story 3.4 — Co-Trainer Değerlendirme Belirsizliği**

AC şöyle: *"Given eğitimin birden fazla co-trainer'ı var → tek bir puan girilir (eğitim başına, eğitmen başına değil)"*

Bu puan kime bağlanıyor? Tüm co-trainer'ların ortalama puanı bu tekil puandan mı hesaplanıyor? PRD bunu netleştirmiyor.

**Öneri:** AC'ye ekle: *"Girilen puan eğitime atanmış TÜM eğitmenlere (primary + co-trainer) ayrı ayrı Evaluation kaydı olarak yazılır; her eğitmenin ortalama puanı bu değerlendirmeden güncellenir."* VEYA puan yalnızca primary eğitmene ait olduğunu net ifade et.

---

**Mi5: Story 5.1 — "Sonraki 30 Gün" İş Kuralı PRD'de Tanımsız**

Story 5.1 AC: *"sonraki 30 gün içindeki eğitimler listelenir"* — bu eşik değeri ne PRD'de ne de UX spec'te tanımlı. Uygulamada farklı yorumlanabilir.

**Öneri:** Bu değeri ya PRD'ye ekle ya da AC'de sabit bir iş kararı olarak belirt.

### Best Practices Compliance Checklist

| Kontrol | Epic 1 | Epic 2 | Epic 3 | Epic 4 | Epic 5 |
|---------|--------|--------|--------|--------|--------|
| Kullanıcı değeri sunuyor | ⚠️ | ✅ | ✅ | ✅ | ✅ |
| Bağımsız çalışabilir | ✅ | ✅ | ✅ | ✅ | ✅ |
| Story'ler uygun boyutlu | ✅ | ✅ | ✅ | ✅ | ✅ |
| Forward dependency yok | ✅ | ✅ | ⚠️ M1 | ⚠️ M1, M4 | ✅ |
| DB modelleri zamanında oluşturuluyor | ✅ | ✅ | ✅ | ✅ | ✅ |
| Acceptance criteria net | ✅ | ⚠️ Mi3 | ⚠️ Mi4 | ⚠️ Mi2 | ⚠️ Mi5 |
| FR traceability korunuyor | ✅ | ✅ | ✅ | ✅ | ✅ |

## Summary and Recommendations

### Overall Readiness Status

> **🟠 NEEDS WORK** — Temel FR/NFR kapsama eksiksiz; ancak UX design system entegrasyonu ve iki story kapsam çakışması çözülmeden implementasyona geçilmesi rework riskini artırır.

### Findings Summary

| Kategori | Durum | Detay |
|----------|-------|-------|
| FR Coverage (43 FR) | ✅ %100 | Tüm gereksinimler epic'lerde kapsanıyor |
| NFR Coverage (9 NFR) | ✅ %100 | Tüm performans ve güvenlik gereksinimleri kapsanıyor |
| UX ↔ PRD Uyumu | ✅ Çatışma yok | UX spec PRD'yi detaylandırıyor, çelişmiyor |
| UX → Epic Aktarımı | ❌ Eksik | 6 kritik UX gereksinimi hiçbir story'de yok |
| UX → Architecture Aktarımı | ❌ Eksik | shadcn/ui, design tokens, sidebar layout mimari belgede yok |
| Epic Bağımsızlığı | ✅ | 5 epic doğru sırayla bağımsız çalışıyor |
| Story Yapısı | ⚠️ | 1 kapsam çakışması, 4 minor AC eksikliği |
| Story Sizing | ✅ | Hiçbir story aşırı büyük değil |

**Toplam tespit:** 0 kritik + 4 major + 5 minor = **9 bulgu**

### Critical Issues Requiring Immediate Action

**[P1] shadcn/ui ve Design Token kurulumu Story 1.1'e eklenmeli**

Story 1.1 tamamlanmadan tüm UI story'leri belirsiz bir bileşen altyapısıyla başlar. En geç Epic 1 kapsamı netleştirilmeden implementasyon başlamamalı.

Yapılacaklar:
- `architecture.md`'e shadcn/ui bileşen kütüphanesi kararını ekle
- Story 1.1 AC'lerine shadcn/ui init + Tailwind token + Inter font + sidebar layout iskeleti ekle

---

**[P2] Story 3.5 kapsamını "backend only" olarak yeniden tanımla**

Story 3.5 ve Story 4.3 aynı profil sayfasına aynı bileşeni yazıyor. Bu çakışma rework'e yol açar.

Yapılacaklar:
- Story 3.5: Backend aggregation endpoint + React Query hook — profil sayfasında display YOK
- Story 4.3: Profil sayfası tüm içeriğiyle (avg puan + bar grafik dahil) Story 3.5 API'sini kullanarak oluşturulur

---

**[P3] Wizard step 3 cross-epic sınırı story'lerde belgelenecek**

Story 3.2 ve Story 4.4 aynı ekranı farklı kademede tamamlıyor. Dev agent net sınırı bilmeli.

Yapılacaklar:
- Story 3.2'ye not ekle: "Wizard adım 3'te önerilen panel yoktur; Story 4.4 tarafından eklenir"
- Story 4.4'e not ekle: "Story 3.2 ile oluşturulan wizard adım 3 ekranına önerilen panel eklenir"

### Recommended Next Steps

1. **Epics.md'yi güncelle** (P1, P2, P3 düzeltmeleri + minor AC eklemeleri) — yaklaşık 30 dakika; Create Epics skill ile ya da manuel düzenleme ile yapılabilir.

2. **Architecture.md'e shadcn/ui ekle** — `architecture.md` bileşen kütüphanesi kararını ve design token yapısını içermeli. Ardından Story 1.1 buna referans verebilir.

3. **UX spec referansını story'lere ekle** — Her UI story'nin AC bölümüne "UX Spec bölüm X'e uygun" şeklinde bir referans, dev agent'ın doğru tasarım kararlarını vermesini sağlar.

4. **Güncellenmiş epic'ler hazırsa Sprint Planning'e geç** — `[SP] bmad-sprint-planning` skill'i çağır.

### Issues Not Requiring Action Before Implementation

Aşağıdaki minor bulgular implementasyon sırasında ya da story refinement aşamasında giderilebilir:

- Mi1: Story 3.1 "konum/notlar" alanı — implement ederken PRD'ye göre çıkart
- Mi2: Story 4.1 empty state AC — Story dev aşamasında eklenebilir
- Mi3: Story 2.1 duplicate skill validasyon AC — Story dev aşamasında eklenebilir
- Mi4: Story 3.4 co-trainer puan netliği — dev başlamadan önce ürün kararı gerekiyor (blocker olabilir)
- Mi5: Story 5.1 "30 gün" eşiği — implement ederken sabit değer olarak kodla, PRD'ye sonra ekle

### Final Note

Bu değerlendirme 9 bulgu tespit etti (0 kritik, 4 major, 5 minor). P1-P3 düzeltmeleri tamamlandıktan sonra sistem implementasyon için hazırdır. FR/NFR kapsama %100 sağlandığı ve epic yapısı sağlam olduğu için bu düzeltmeler minimal eforla gerçekleştirilebilir.

---

**Değerlendirme tamamlandı:** 2026-05-06
**Değerlendirici:** bmad-check-implementation-readiness
**Giriş dokümanları:** prd.md, architecture.md, epics.md, ux-design-specification.md
