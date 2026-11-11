# Elle Test Listesi

Her aşamanın elle test adımları bu dosyadadır. Kabul testleri SPEC bölüm 11'dedir.

## Aşama 0 — Plan

Bu aşamada kod yok. Kontrol belgeler üzerinden yapılır.

- [ ] `docs/PLAN.md` var. Bileşen ağacı, reducer eylemleri, riskler ve aşama başına dosya listesi bölümleri var.
- [ ] SPEC sürüm 4: 4.2'de tek `ad:notebook:corrupt` anahtarı ve üzerine yazma kuralı var.
- [ ] SPEC 6.5: üç sekme (Çıkartmalar, Süsler, Özellikler) ve seçim kalkınca son kütüphane sekmesine dönüş var.
- [ ] SPEC 6.5 ve 7.1: döndürme kaydırıcısı ve "Arkaya gönder" var, tutamaçlar duruyor.
- [ ] SPEC 8.4: fontlar TTF. Caveat değişken, Lora değişken + italik, Courier Prime 4 dosya. El yazısında İtalik pasif.
- [ ] DECISIONS 23–43 senin cevaplarınla uyuşuyor.
- [ ] AI-LOG'da referans görselin bir yapay zekâ aracıyla üretildiği yazıyor.
- [ ] `git status` yalnızca `docs/` altındaki dosyaları değişmiş gösteriyor.

### PLAN incelemesi sonrası düzeltmeler

- [ ] **panelTab ayrı durum:** PLAN 1 ve 1.1'de `panelTab` ile `lastLibraryTab` ayrı durum olarak duruyor. Tabloya göre nesne seçiliyken bir kütüphane sekmesine ya da araç çubuğundaki Çıkartma/Süs butonuna basınca o sekme açılıyor ve seçim duruyor. SPEC 6.5 ve karar 44 aynı şeyi söylüyor.
- [ ] **item/measure yeni adım açmıyor:** PLAN 3.1 ve 3.2'de `item/measure` yalnızca `present` durumunu güncelliyor. `past`, `future` ve `lastChangedPageId` değişmiyor. Aşama 2 test listesinde (`history.test.js`) bunun testi var. SPEC 7.4 ve karar 45 aynı şeyi söylüyor.
- [ ] **Geçersiz referans temizliği:** PLAN 3.4'te `reconcileUi` dört referansı (`selectedItemId`, `editingItemId`, `activePageId`, `lastChangedPageId`) kontrol ediyor. Silinen sayfa için en yakın sayfaya gidiliyor. `spreadIndex` açılışta sınırlanıyor. Aşama 2 test listesinde `uiReducer.test.js` var. Karar 46.
- [ ] **Esnek doğrulama:** PLAN 4.1 tablosunda kayıt yalnızca üç durumda bozuk sayılıyor: JSON hatası, `pages` yok, `schemaVersion` tanınmıyor. Aşama 2 test listesinde `storage.test.js` için "eski biçimli kayıt bozuk sayılmaz ve yerinde kalır" testi var. SPEC 4.2 ve karar 47 aynı şeyi söylüyor.
- [ ] **storage olayı uyarısı:** PLAN 4.2 ve SPEC 4.4'te uyarı metni şu: "Defterin başka bir sekmede değişti. Kaybı önlemek için bu sekmeyi yenile." Bir "Yenile" butonu var. Otomatik kayıt ve `pagehide` kaydı duruyor. Birleştirme yok. İş Aşama 2'de. SPEC 12'de bilinen sınır olarak yazılı. Karar 48.
- [ ] **Caveat'ta italik korunuyor ama uygulanmıyor:** SPEC 8.4, PLAN 4.3 ve karar 49'da `italic` değeri kayıtta kalıyor, El yazısında uygulanmıyor, başka fonta geçince yeniden uygulanıyor. Aşama 3 test listesinde `textStyle.test.js` var.

## Aşama 1 — Kurulum ve görsel iskelet

Hazırlık: `npm install` (gerekirse), sonra `npm run dev`. Tarayıcıda gösterilen adresi aç. Ekran genişliğini DevTools'taki cihaz araç çubuğuyla (Ctrl+Shift+M) ayarla.

### Komutlar

- [ ] `npm run build` hatasız bitiyor.
- [ ] `npm run lint` hiçbir hata ve uyarı vermiyor.
- [ ] `npm test` 3 testi geçiriyor.

### 1440 × 900

- [ ] Üst çubuk koyu. Solda taç ikonu, "Anı Defterim" ve el yazısıyla "Burası benim krallığım" var. Ortada yeşil noktalı "Kaydedildi" var. Sağda Geri al ve Yinele butonları pasif (kesik çizgili kenar, soluk yazı, "yasak" imleci).
- [ ] Açık defter ekranın ana odağı. İki sayfa yan yana. Kağıt tonu, hafif doku, noktalı grid, ortada cilt gölgesi, yuvarlak köşeler ve katmanlı gölge var.
- [ ] Sol sayfanın üstünde "Sayfa 1", sağ sayfanın üstünde sağa yaslı "Sayfa 2" yazıyor.
- [ ] Sol sayfanın kenarında hafif lavanta parıltısı var (aktif sayfa).
- [ ] İki sayfanın ortasında soluk el yazısıyla "Panelden bir fotoğraf, çıkartma ya da not ekle →" yazıyor.
- [ ] Sol sayfanın altında "Anı Defterim", sağ sayfanın altında "Burası benim krallığım" yazıyor. Sağ sayfanın üst kenarında lavanta ayraç şeridi var.
- [ ] Ayraç şeridi sağ sayfanın başlığına binmiyor. "Sayfa 2" yazısı ile ayraç arasında boşluk var.
- [ ] Uzun başlık testi: DevTools konsolunda şunu çalıştır: `document.querySelectorAll('.page-title')[1].textContent = 'Kırk karakterlik çok uzun bir başlık deneme'`. Başlık ayraca değmeden `…` ile kesiliyor. Sayfayı yenileyince eski başlık geri gelir.
- [ ] Defterin altında sayfa çubuğu var: "Önceki", "Sayfa 1–2 / 2", "Sonraki", "Sayfa ekle", "Sayfayı sil". Butonların hepsi pasif. "Sayfayı sil" kırmızımsı.
- [ ] Sayfa çubuğunun altında yüzen araç çubuğu var: Fotoğraf ekle, Çıkartma, Süs, Yazı ekle, Seçileni sil. Hepsi pasif. Araç çubuğu deftere binmiyor.
- [ ] Sağda koyu cam panel var. Üç sekme: Çıkartmalar (seçili, lavanta alt çizgi), Süsler ve Özellikler (pasif). Altta "Depolama %0" göstergesi var.
- [ ] Arka plan düz siyah değil. Mor ve yeşil ışık lekeleri çok yavaş kayıyor (30 saniye kadar izle).
- [ ] Sayfada yatay ya da dikey kaydırma çubuğu yok.

### 1024 × 768

- [ ] Yerleşim bozulmuyor. Defter küçülüyor ama oranı korunuyor. Sayfa başlıkları, ipucu ve alt yazılar defterle birlikte küçülüyor.
- [ ] Sayfa çubuğu ve araç çubuğu tek satırda duruyor, ekrandan taşmıyor.
- [ ] Panel ekranın içinde kalıyor. Depolama göstergesi görünüyor.
- [ ] Kaydırma çubuğu yok.

### Dar ekran

- [ ] 800 px genişlikte yalnızca bilgi kartı görünüyor: taç, "Anı Defterim", "Anı Defterim bilgisayar ekranı için tasarlandı. Lütfen bir bilgisayardan aç."
- [ ] 1023 px'te bilgi kartı, 1024 px'te uygulama görünüyor.

### Fontlar

- [ ] DevTools → Network → "Font" filtresi: Caveat, Lora ve Courier Prime yerel adresten (`/src/assets/fonts/...`) yükleniyor. Hiçbir dış adrese istek yok.
- [ ] DevTools → Elements → "Burası benim krallığım" yazısını seç → Computed sekmesinin altındaki "Rendered Fonts" alanında yalnızca "Caveat" yazıyor. Aynı kontrolü üst çubuktaki "Anı Defterim" (Lora) ve sayfa sayacı (Courier Prime) için yap.
- [ ] Türkçe karakter testi: DevTools konsolunda şunu çalıştır: `document.querySelector('.page__hint').textContent = 'Ilık şömine, güzel çay, İstanbul, ĞÜŞİÖÇ'`. Bütün harfler aynı el yazısı fontuyla görünüyor. "Rendered Fonts" alanında yalnızca "Caveat" var. Sayfayı yenileyince eski metin geri gelir.

### Hareket ve konsol

- [ ] İşletim sisteminde animasyonları kapat (Windows: Ayarlar → Erişilebilirlik → Görsel efektler → Animasyon efektleri kapalı). Sayfayı yenile. Arka plan ışıkları hareket etmiyor.
- [ ] Konsolda hata ya da uyarı yok.

### Netlify ilk yayın (karar 38)

1. Projeyi GitHub'a gönder (public depo).
2. Netlify → "Add new site" → "Import an existing project" → GitHub deposunu seç.
3. Ayarlar `netlify.toml` dosyasından gelir: build komutu `npm run build`, yayın klasörü `dist`. Elle değiştirme.
4. "Deploy" düğmesine bas. Yayın bitince verilen bağlantıyı aç.

- [ ] Canlı bağlantı açılıyor ve 1440 px görünümü yereldeki ile aynı.
- [ ] Canlı bağlantıda fontlar yükleniyor (Network sekmesinde 404 yok).
