---
stepsCompleted: [step-01-init, step-02-discovery, step-02b-vision, step-02c-executive-summary, step-03-success, step-04-journeys, step-05-domain, step-06-innovation, step-07-project-type, step-08-scoping, step-09-functional, step-10-nonfunctional, step-11-polish, step-12-complete]
completedAt: '2026-05-06'
releaseMode: single-release
inputDocuments: []
workflowType: 'prd'
classification:
  projectType: web_app
  domain: edtech_kurumsal_egitim
  complexity: medium
  projectContext: greenfield
---

# Product Requirements Document - Akademi Portalı

**Yazar:** ugerdem
**Tarih:** 2026-05-06

## Yönetici Özeti

Akademi Portalı, kurumların eğitmen havuzunu Excel tabanlı, dağınık ve hatalara açık süreçlerden kurtararak tek ve güvenilir bir dijital platforma taşımak için tasarlanmış bir web uygulamasıdır. Sistem; eğitmen yönetimi, skill kataloğu, eğitim planlama ve takvim yönetimini tek çatı altında birleştirir. Hedef kullanıcı, kurumun tüm eğitim koordinasyon süreçlerini yürüten **Eğitim Koordinatörü**'dür.

Koordinatör; eğitmenleri tanımlar, skill ve deneyim bilgilerini merkezi katalogdan seçerek girer, eğitim programları oluşturur, uygun eğitmeni saniyeler içinde bulup atar ve eğitim sonrası değerlendirme puanını sisteme işler. Tüm bu adımlar tek bir arayüzden tamamlanır — birden fazla Excel dosyası, e-posta yazışması ve manuel takvim takibi geçmişte kalır.

### Fark Yaratan Özellik

Sistemin temel değeri eğitmen arama deneyimidir. Koordinatör; konu, puan eşiği, kurum içi/dışı durumu ve danışmanlık firması gibi kriterlerle chip filtreler aracılığıyla anlık arama yapar. Sistem, eğitim tanımlandığı anda ilgili konuda en yüksek puanlı ve o gün müsait eğitmenleri otomatik olarak önerir. Eğitmen profilleri; tamamlanan eğitimlerden hesaplanan ortalama puan ve yıllık eğitim sayısı grafiğiyle beslenir.

## Proje Sınıflandırması

| Alan | Değer |
|------|-------|
| Proje Tipi | Web Uygulaması (Next.js + MongoDB) |
| Domain | Kurumsal Eğitim Yönetimi |
| Karmaşıklık | Orta |
| Proje Bağlamı | Greenfield |
| Kullanıcı Rolü | Eğitim Koordinatörü (tek rol, herkese açık kayıt) |
| Platform | Yalnızca masaüstü tarayıcı |

## Başarı Kriterleri

### Kullanıcı Başarısı

- Koordinatör, eğitmen aramadan atamasına kadar tüm süreci tek ekrandan tamamlayabilir
- Doğru eğitmeni bulmak için uygulama dışında herhangi bir araca başvurma ihtiyacı kalmaz
- Eğitim atama sırasında çakışma riski görünür ve anlaşılır biçimde uyarılır
- Eğitim tamamlandığında puan girişi doğal akışın parçasıdır
- Eğitmen profili, koordinatöre geçmişi ve yetkinlikleri hakkında yeterli bilgi sunar

### İş Başarısı

- Kurum eğitmen havuzu tek ve güvenilir bir sistemde tutulur; Excel dosyaları süreçten çıkar
- Tüm eğitim geçmişi ve eğitmen değerlendirmeleri kayıt altında ve erişilebilir olur

### Teknik Başarı

- Sistem güvenilir biçimde çalışır; eğitmen, skill, eğitim ve puan kayıtları veri bütünlüğünü korur
- Next.js + MongoDB mimarisi üzerinde ölçeklenebilir yapı kurulur
- Tüm tanımlı özellikler çalışır ve test edilmiş durumda devreye alınır

## Ürün Kapsamı

### Tek Sürüm Stratejisi

Tüm özellikler aynı anda devreye alınır. Hedef: Excel tabanlı süreci tamamen dijitalize eden, üretim ortamına hazır bir sistem.

### MVP Özellikleri

- Kullanıcı giriş ve kayıt
- Eğitmen tanımlama, düzenleme, soft delete (ad, soyad, kurum içi/dışı, danışmanlık firması, özgeçmiş)
- Merkezi skill kataloğu (seçimli, koordinatör yönetir, soft delete)
- Eğitim wizard'ı (tanımla + ata; tekli/co-trainer; soft warning çakışma; iptal + not)
- Takvim dashboard (takvim/liste/kart görünümü; kendi/tüm akademi eğitimleri seçimi; önerilen eğitmenler)
- Eğitim tamamlama akışı (zorunlu puan girişi)
- Eğitmen arama (chip filtreler, CSV export)
- Eğitmen profil sayfası (read-only + edit, yıllık eğitim bar grafik, ortalama puan)

### Sonraki Sürüm (Post-MVP)

- Eğitmen profiline konu dağılımı pasta/donut grafik
- Gelişmiş raporlama ve analitik

### Gelecek Vizyon

- Diğer kurumsal sistemlerle (İK, takvim uygulamaları) entegrasyon

### Risk Azaltma

- **Önerilen Eğitmenler sorgusu:** MongoDB aggregation tasarımı erken yapılmalı; puan + müsaitlik kombinasyonu performans kritik
- **Aggregation optimizasyonu:** Bar grafik ve ortalama puan her profil açılışında yeniden hesaplanmamalı
- **Veri giriş yükü:** Form tasarımı hız odaklı yapılmalı; skill + puan girişi az adımda tamamlanmalı
- **Kapsam sürünmesi:** Wizard akışı ve profil sayfası en çok zaman alabilecek bileşenler

## Kullanıcı Yolculukları

### Yolculuk 1 — Eğitim Planlama ve Eğitmen Atama

Ayşe, gelecek ay için bir "Proje Yönetimi" eğitimi planlaması gerektiğini öğrendi. Geçmişte bu iş saatler alırdı: eski Excel'i aç, birden fazla sekmeyi karşılaştır, kimin müsait olduğunu elle kontrol et, mail at, cevap bekle.

Bugün sistemi açıyor. Eğitim Tanımla ekranına geçiyor — konu, tarih, süre giriyor. Wizard'ın son adımında "Önerilen Eğitmenler" bölümü beliriyor: Proje Yönetimi konusunda en yüksek puanlı ve o gün müsait 3 eğitmen listeleniyor. Ayşe ilk sıradaki eğitmeni seçiyor, co-trainer ekliyor, kaydediyor. Toplam süre: 4 dakika.

**Ortaya çıkan gereksinimler:** Eğitim wizard'ı, önerilen eğitmenler, co-trainer seçimi, çakışma soft warning.

---

### Yolculuk 2 — Yeni Eğitmen Tanımlama

Kurumun yeni bir danışmanlık firmasından freelance bir veri bilimcisi geliyor. Ayşe, Eğitmen Ekle formunu açıyor. "Kurum dışı" seçiyor — form otomatik olarak danışmanlık firması alanını açıyor. Özgeçmiş alanına kısa bir tanıtım yazısı yapıştırıyor. Skill bölümünde merkezi katalogdan "Python", "Makine Öğrenmesi", "Veri Görselleştirme" seçiyor, her birine 10 üzerinden puan giriyor. Kaydediyor. Eğitmen arama sonuçlarında görünür.

**Ortaya çıkan gereksinimler:** Eğitmen formu, kurum içi/dışı koşullu alan, skill katalog seçimi, puan girişi.

---

### Yolculuk 3 — Eğitim Tamamlama ve Puan Girişi

"İletişim Becerileri" eğitimi sona erdi. Ayşe takvim dashboardundan eğitimi buluyor, "Tamamlandı" olarak işaretlemek istiyor. Sistem puan girişini zorunlu kılıyor — atlamak mümkün değil. Ayşe 10 üzerinden 8 giriyor. Eğitmenin profil sayfasındaki ortalama puan ve yıllık eğitim bar grafiği otomatik güncelleniyor.

**Ortaya çıkan gereksinimler:** Tamamlama akışında zorunlu puan, otomatik ortalama puan hesabı, profil güncelleme.

---

### Yolculuk 4 — Eğitim İptali ve Yeniden Planlama

Planlanan eğitmen hastalandı. Ayşe takvimden eğitimi buluyor, "İptal Et" seçiyor, not giriyor ("Eğitmen sağlık sorunu"). Eğitim takvimde iptal rengiyle kalıyor — kayıt silinmiyor. Çakışma bloğu kalkıyor; eğitmen o tarihte yeniden atanabilir. Bir hafta sonra Ayşe aynı eğitimi yeni bir tarihle yeniden oluşturuyor.

**Ortaya çıkan gereksinimler:** İptal durumu + not, takvimde renk kodlaması, çakışma bloğu kaldırma.

---

### Yolculuk Gereksinimleri Özeti

| Kapasite | Yolculuk |
|----------|---------|
| Eğitim wizard'ı (tanımla + ata) | 1, 4 |
| Önerilen eğitmenler | 1 |
| Co-trainer seçimi | 1 |
| Çakışma soft warning + bloğu kaldırma | 1, 4 |
| Eğitmen formu (koşullu alanlar) | 2 |
| Skill katalog + puan girişi | 2 |
| Tamamlama akışı (zorunlu puan) | 3 |
| Ortalama puan + bar grafik otomasyonu | 3 |
| İptal durumu + renk kodlaması + not | 4 |

## Web Uygulaması Teknik Gereksinimleri

### Mimari

- **Rendering:** Next.js App Router, SPA davranışı; tam sayfa yenileme olmadan sayfa geçişleri
- **Veri Tabanı:** MongoDB — eğitmen, skill, eğitim ve atama koleksiyonları
- **Kimlik Doğrulama:** JWT tabanlı; koordinatör giriş/kayıt
- **Gerçek Zamanlılık:** Gerekmiyor; çakışma kontrolü atama sırasında sunucu tarafında yapılır
- **SEO:** Gerekmiyor — dahili araç

### Tarayıcı Desteği

| Tarayıcı | Destek |
|---------|--------|
| Chrome (son sürüm) | ✅ |
| Firefox (son sürüm) | ✅ |
| Edge (son sürüm) | ✅ |
| Safari (son sürüm) | ✅ |
| Mobil tarayıcılar | ❌ Kapsam dışı |

### Uygulama Kararları

- **Çakışma kontrolü:** Atama kaydedilmeden önce o günkü eğitmen doluluk sorgusu sunucu tarafında çalışır
- **Soft delete:** Eğitmen ve skill kayıtları `isActive` flag ile pasife alınır; fiziksel silme yapılmaz
- **Erişilebilirlik:** Standart hedeflenmez; temel HTML semantiği yeterlidir

## Functional Requirements

### Kimlik Yönetimi

- **FR1:** Koordinatör sisteme kayıt olabilir
- **FR2:** Koordinatör sisteme giriş yapabilir
- **FR3:** Koordinatör oturumunu sonlandırabilir

### Eğitmen Yönetimi

- **FR4:** Koordinatör yeni eğitmen kaydı oluşturabilir (ad, soyad, kurum içi/dışı, özgeçmiş)
- **FR5:** Koordinatör kurum dışı eğitmen için danışmanlık firması bilgisi girebilir
- **FR6:** Koordinatör mevcut eğitmen profilini düzenleyebilir
- **FR7:** Koordinatör eğitmeni pasife alabilir (soft delete)
- **FR8:** Koordinatör pasif eğitmeni yeniden aktive edebilir
- **FR9:** Sistem pasif eğitmeni yeni atamalarda ve arama sonuçlarında listelemez

### Skill Kataloğu

- **FR10:** Koordinatör merkezi skill kataloğuna yeni skill ekleyebilir
- **FR11:** Koordinatör bir eğitmene katalogdan skill atayabilir ve 10 üzerinden deneyim puanı girebilir
- **FR12:** Koordinatör bir eğitmenin mevcut skill puanını güncelleyebilir
- **FR13:** Koordinatör eğitmene atanmış bir skill'i profilden kaldırabilir
- **FR14:** Koordinatör katalogdaki bir skill'i pasife alabilir
- **FR15:** Sistem pasif skill'i yeni atamalarda göstermez; mevcut kayıtlar korunur
- **FR16:** Sistem her skill'in sisteme kayıt tarihini kaydeder ve görüntüler

### Eğitim Yönetimi

- **FR17:** Koordinatör tek wizard akışında eğitim tanımlayabilir ve eğitmen atayabilir
- **FR18:** Koordinatör bir eğitime tek eğitmen atayabilir
- **FR19:** Koordinatör bir eğitime birden fazla eğitmen (co-trainer) atayabilir
- **FR20:** Sistem atama sırasında eğitmenin (ana ve co-trainer) o günkü doluluk durumunu gösterir ve çakışma varsa uyarır
- **FR21:** Koordinatör eğitimi iptal edebilir ve iptal notu ekleyebilir
- **FR22:** Sistem iptal edilen eğitimi silmez; takvimde farklı renk/ikon ve notla gösterir
- **FR23:** Sistem iptal edilen eğitime atanmış eğitmenlerin o günkü çakışma bloğunu kaldırır
- **FR24:** Koordinatör eğitimi tamamlandı olarak işaretleyebilir
- **FR25:** Sistem eğitimi tamamlandı olarak işaretlerken puan girişini zorunlu kılar

### Eğitmen Arama & Keşif

- **FR26:** Koordinatör eğitmenleri ad/soyad, kurum içi/dışı, danışmanlık firması, skill ve minimum puan eşiği kriterlerine göre filtreleyebilir
- **FR27:** Koordinatör arama filtrelerini chip olarak ekleyip kaldırabilir
- **FR28:** Sistem arama sonuçlarında eğitmenin adı, soyadı, kurum içi/dışı durumu ve ortalama puanını ana görünümde gösterir
- **FR29:** Koordinatör arama sonuçlarında ikincil görünüm olarak eğitmenin skill listesini görebilir
- **FR30:** Koordinatör eğitmen arama sonuçlarını CSV olarak indirebilir
- **FR31:** Koordinatör eğitmen profilini read-only modda görüntüleyebilir
- **FR32:** Koordinatör eğitmen profilini edit modunda düzenleyebilir
- **FR33:** Sistem atama ekranında ilgili eğitim konusunda en yüksek puanlı ve o gün müsait eğitmenleri önerir

### Takvim & Dashboard

- **FR34:** Koordinatör eğitimlerini takvim görünümünde görebilir
- **FR35:** Koordinatör eğitimlerini liste görünümünde görebilir
- **FR36:** Koordinatör eğitimlerini kart görünümünde görebilir
- **FR37:** Koordinatör yalnızca kendi tanımladığı eğitimleri veya tüm akademi eğitimlerini görüntüleme arasında geçiş yapabilir
- **FR38:** Dashboard açılışında bu haftaki ve yaklaşan eğitimlerin özeti görünür
- **FR39:** Sistem takvimde iptal edilen eğitimleri farklı renk/ikon ile gösterir

### Değerlendirme & Puanlama

- **FR40:** Koordinatör tamamlanan eğitim için eğitmene 10 üzerinden puan girebilir
- **FR41:** Sistem eğitmenin ortalama puanını tamamlanan tüm eğitimlerden otomatik hesaplar ve günceller
- **FR42:** Eğitmen profil sayfasında yıllık eğitim sayısı bar grafik olarak görüntülenir
- **FR43:** Eğitmenin ortalama puanı arama sonuçlarında ve profil sayfasında görünür

## Non-Functional Requirements

### Performans

- **NFR1:** Eğitmen arama sorguları 1 saniye içinde sonuç döndürmelidir
- **NFR2:** Önerilen Eğitmenler sorgusu (puan + müsaitlik aggregation) 1,5 saniye içinde tamamlanmalıdır
- **NFR3:** Eğitmen profil sayfası bar grafik ve ortalama puan verileri 2 saniye içinde yüklenmelidir
- **NFR4:** SPA sayfa geçişleri 300ms altında tamamlanmalıdır

### Güvenlik

- **NFR5:** Tüm API istekleri kimlik doğrulaması gerektirmelidir; doğrulanmamış istekler reddedilmelidir
- **NFR6:** Koordinatör şifreleri bcrypt veya eşdeğeriyle hash'lenerek saklanmalıdır
- **NFR7:** JWT token'ları süre sınırına tabi olmalı ve oturum sonlandırmada geçersiz kılınmalıdır
- **NFR8:** Tüm istemci-sunucu iletişimi HTTPS üzerinden yapılmalıdır
- **NFR9:** Eğitmen kişisel verileri yalnızca oturum açmış koordinatörlere erişilebilir olmalıdır
