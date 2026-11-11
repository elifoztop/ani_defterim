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

Depo: https://github.com/elifoztop/ani_defterim (public) · Canlı adres: https://ani-defterim.netlify.app

- [x] Canlı bağlantı açılıyor ve 1440 px görünümü yereldeki ile aynı.
- [x] Canlı bağlantıda fontlar yükleniyor (Network sekmesinde 404 yok).
- [x] Canlı bağlantı gizli pencerede giriş istemeden açılıyor (Netlify projesi public).
- [x] Canlı bağlantıda konsolda hata yok. 1024 × 768'de bütün alanlar sığıyor. 800 px'te yalnızca bilgi kartı görünüyor.

## Aşama 2 — Veri ve kayıt

Hazırlık: `npm run dev`. Tarayıcıda adresi aç. 1440 × 900 pencere kullan. Temiz başlangıç için DevTools → Application → Local Storage → adresini seç → `ad:` ile başlayan anahtarları sil → sayfayı yenile.

### Komutlar

- [ ] `npm run build` hatasız bitiyor.
- [ ] `npm run lint` hiçbir hata ve uyarı vermiyor.
- [ ] `npm test` 63 testi geçiriyor.

### Sayfa yönetimi (kabul testi 2)

- [ ] İlk açılışta "Sayfa 1" ve "Sayfa 2" var. Sayfa çubuğunda "Sayfa 1–2 / 2" yazıyor. "Önceki" ve "Sonraki" pasif.
- [ ] Sağ sayfaya tıkla. Lavanta parıltı sağ sayfaya geçiyor (aktif sayfa).
- [ ] "Sayfa ekle"ye bas. Defter "Sayfa 3"ün açık defterine geçiyor, geçişte kısa bir solma var. Sol sayfa "Sayfa 3", sağ yüzde "Sayfa ekle" butonlu boş yüz var. Sayaç "Sayfa 3 / 3".
- [ ] Boş yüzdeki "Sayfa ekle" butonuna bas. "Sayfa 4" sağ sayfada açılıyor ve aktif.
- [ ] "Önceki" ve "Sonraki" açık defterler arasında geçiyor. Geçince aktif sayfa sol sayfa oluyor.
- [x] Toplam 8 sayfaya kadar ekle. 8. sayfadan sonra "Sayfa ekle" pasif.
- [x] 8 sayfada "Sayfa ekle" butonunun üstüne gelince "En fazla 8 sayfa olabilir." ipucu görünüyor.
- [ ] Bir sayfanın başlığına tıkla. Başlık yerinde düzenlenebilir hâle geliyor, metin seçili. "Tatil" yaz, Enter'a bas. Başlık değişiyor.
- [ ] Başka bir başlığı düzenle, sonra sayfanın boş yerine tıkla. Değişiklik kaydediliyor.
- [ ] Bir başlığı düzenlerken Esc'ye bas. Eski başlık geri geliyor.
- [ ] Bir başlığı tamamen sil ve Enter'a bas. Başlık "Sayfa N" oluyor (N sayfanın sırası).
- [ ] 40 karakterden uzun yazmaya çalış. 40 karakterden sonrası yazılmıyor.
- [ ] Bir sayfayı aktif yap ve "Sayfayı sil"e bas. Onay penceresi açılıyor: "“{başlık}” sayfası ve üzerindeki her şey silinecek. Emin misin?"
- [ ] "Vazgeç"e bas, sayfa duruyor. Tekrar aç ve Esc'ye bas, sayfa duruyor.
- [ ] Tekrar aç ve "Sayfayı sil"e bas. Sayfa siliniyor. Aktif sayfa aynı sıradaki sayfa oluyor. Son sayfayı silersen yeni son sayfa aktif oluyor ve onun açık defterine geçiliyor.
- [ ] Tek sayfa kalana kadar sil. "Sayfayı sil" pasif.

### Başlık numaraları (karar 78, elle test düzeltmesi)

- [x] Temiz başlangıçtan 8 sayfaya kadar ekle. 2. sayfayı sil, sonra 5. sırada duran sayfayı sil. 2 sayfa ekle. Bütün başlıklar "Sayfa 1"den "Sayfa 8"e sırayla görünüyor, tekrar eden numara yok.
- [x] Bir sayfaya "Tatil" başlığı ver. Ondan önceki bir sayfayı sil. "Tatil" değişmiyor, başlıksız sayfaların numaraları yeni sıraya göre kayıyor.
- [x] Geri al ile silinen sayfayı geri getir. Numaralar yine sırayla doğru.
- [ ] Başlıksız bir sayfanın başlığına tıkla. Alan boş açılıyor, içinde soluk "Sayfa N" ipucu var. Hiçbir şey yazmadan Enter'a bas. Başlık değişmiyor ve Geri al geçmişine yeni adım eklenmiyor.
- [ ] DevTools → Local Storage → `ad:notebook:v1`: başlıksız sayfaların `title` değeri `""`, "Tatil" olduğu gibi duruyor.
- [ ] Eski kayıt geçişi: `ad:notebook:v1` değerini `{"schemaVersion":1,"pages":[{"id":"a","title":"Sayfa 8"},{"id":"b","title":"Sayfa 2"},{"id":"c","title":"Okul"},{"id":"d","title":"Sayfa 2"}]}` yap, yenile. Başlıklar "Sayfa 1", "Sayfa 2", "Okul", "Sayfa 4" görünüyor. Uyarı çıkmıyor.

### Geri al / Yinele (sayfa eylemleri)

- [ ] İlk açılışta Geri al ve Yinele pasif.
- [x] Sayfa ekle, başlık değiştir, sayfa sil. Geri al'a üç kez bas: sırayla sayfa geri geliyor, başlık eski hâline dönüyor, eklenen sayfa kalkıyor. Her adımda uygulama değişen sayfanın açık defterine geçiyor.
- [x] Yinele'ye üç kez bas: üç değişiklik yeniden uygulanıyor.
- [ ] Geri al'dan sonra yeni bir değişiklik yap. Yinele pasif oluyor.
- [ ] Önceki/Sonraki ile gezinmek Geri al geçmişine girmiyor.

### Kayıt durumu (kabul testi 4)

- [x] Bir değişiklik yap. Üst çubukta altın noktalı "Kaydedilmemiş değişiklik" görünüyor, yaklaşık yarım saniye sonra kısa bir süre "Kaydediliyor…", sonra yeşil noktalı "Kaydedildi".
- [ ] Hızla arka arkaya birkaç sayfa ekle. Durum son değişiklikten sonra "Kaydedildi"ye dönüyor.

### Yenileme (kabul testi 3, Aşama 2 bitti tanımı)

- [x] Boş defterden başla. 5 sayfa ekle (toplam 7). İkisine başlık ver. Birini sil. "Kaydedildi" görününce sayfayı yenile (F5). Bütün sayfalar, başlıklar ve sıralar aynı.
- [ ] Yenilemeden önce hangi açık defterdeysen yenileyince yine o açık defter açık.
- [ ] Bir başlık değiştir ve hemen (yarım saniye dolmadan) F5'e bas. Değişiklik kaybolmamış (`pagehide` kaydı).
- [ ] Yenileme sonrası Geri al pasif (geçmiş kaydedilmez).

### Bozuk kayıt (kabul testi 5)

- [ ] DevTools → Application → Local Storage → `ad:notebook:v1` değerini `{bozuk` yap. Sayfayı yenile. Uygulama çökmüyor, iki boş sayfayla açılıyor. Altta "Kayıtlı defter okunamadı…" uyarısı var, "Kapat" ile kapanıyor.
- [ ] Local Storage'da `ad:notebook:corrupt` anahtarı var, değeri `{bozuk`. Konsolda ayrıntı yazıyor.
- [ ] Tekrar boz ve `{"schemaVersion":2,"pages":[]}` yaz, yenile. Aynı uyarı çıkıyor. `ad:notebook:corrupt` yeni değeri tutuyor, ikinci bir yedek anahtar yok.
- [ ] Esnek doğrulama: `ad:notebook:v1` değerini `{"schemaVersion":1,"pages":[{"title":"Eski"},{}]}` yap, yenile. Uyarı çıkmıyor. "Eski" ve "Sayfa 2" açılıyor. Konsolda yenilenen id'ler için bir uyarı satırı var.

### Depolama göstergesi

- [ ] Boş defterde panelin altında "Depolama %1'den az" görünüyor (karar 76). Bütün `ad:` anahtarları silinip sayfa yenilendiği anda, ilk kayıttan önce "%0" görünebilir.
- [ ] Konsolda çalıştır: `localStorage.setItem('ad:test', 'x'.repeat(4200000))`. Bir sayfa başlığını değiştir. Kayıttan sonra gösterge %84 civarı ve altın renkli, altında "Depolama alanı dolmak üzere." yazıyor.
- [ ] Kota testi: konsolda `localStorage.setItem('ad:test', 'x'.repeat(5000000))` dene. Tarayıcı hata verirse sayıyı azalt (ör. 5200000 − defter uzunluğu); amaç alanı tamamen doldurmak. Sonra bir başlık değiştir. Durum "Kaydedilemedi" oluyor ve "Değişiklik kaydedilemedi, depolama alanı dolu…" uyarısı çıkıyor. Ekrandaki sayfalar silinmiyor.
- [ ] Temizlik: `localStorage.removeItem('ad:test')`, sonra bir değişiklik yap. Durum "Kaydedildi"ye dönüyor.

### Birden çok sekme (SPEC 4.4)

- [ ] Uygulamayı iki sekmede aç. A sekmesinde bir başlık değiştir. B sekmesinde kapanmayan bir uyarı çıkıyor: "Defterin başka bir sekmede değişti. Kaybı önlemek için bu sekmeyi yenile." Durum "Kayıt durduruldu".
- [ ] B sekmesinde bir değişiklik yap. Durum "Kayıt durduruldu" kalıyor. A sekmesinde uyarı çıkmıyor (B yazmadı). A'yı yenile: A'nın değişikliği duruyor.
- [ ] B'de "Yenile"ye bas. Sayfa yenileniyor, A'daki değişiklik görünüyor, uyarı yok.

### Panel sekmeleri

- [ ] "Süsler" sekmesine bas. Sekme seçili oluyor, içerikte "Süsler burada görünecek." yazıyor. Özellikler pasif.
- [x] Sayfayı yenile. "Süsler" sekmesi açık geliyor.

### Konsol

- [ ] Bütün akış boyunca konsolda kırmızı hata yok (bozuk kayıt ve kota testlerindeki beklenen ayrıntı mesajları hariç).

Özet: Elle deneme: yapıldı (sayfa yönetimi, başlık numaraları, kalıcılık, Geri al/Yinele, kayıt durumu, panel sekmesi). Sorun: bozuk kayıt, depolama doldurma ve iki sekme senaryoları elle denenmedi.

## Aşama 3 — Editör

Elle deneme: yapıldı.

## Aşama 4 — İçerik

Elle deneme: yapıldı. Çizimler onaylandı.

## Aşama 5 — Temizlik ve teslim

Elle deneme: bekliyor (canlı bağlantıda SPEC 11 kabul testleri 1–14). Aşama 2'de denenmeyen bozuk kayıt, depolama doldurma ve iki sekme senaryoları da bu turda denenmeli.
