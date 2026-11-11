# Anı Defterim — Ürün ve Teknik Tanım (SPEC)

Sürüm: 4 (Aşama 0 cevaplarıyla güncellendi) · Planlama tarihi: 11 Kasım 2026 · Teslim süresi: 1-2 hafta

Slogan: "Burası benim krallığım."

Anı Defterim, bilgisayar tarayıcısında çalışan bir dijital scrapbook defteridir. Kullanıcı defterin sayfalarına fotoğraf, çıkartma, süs ve yazı yerleştirir. Uygulama her değişikliği tarayıcıya kendisi kaydeder. Kullanıcı sayfayı kapatıp açınca defteri aynen bulur.

**Projenin kalbi kalıcı kayıttır.** Bir özellik kaydı riske atıyorsa o özellik bekler.

---

## 1. Kapsam

### 1.1 Bu sürümde var

- Açık defter görünümü. Defterin her yüzü ayrı bir sayfadır. Ekranda yan yana iki sayfa görünür.
- Sayfa ekleme, silme, başlık verme, önceki/sonraki. En fazla 8 sayfa.
- Dört nesne türü: fotoğraf (polaroid), hazır çıkartma, süs, yazı.
- Nesne seçme, taşıma, boyutlandırma, döndürme, öne getirme, silme.
- Undo / Redo (30 adım).
- LocalStorage ile otomatik kayıt, kayıt durumu ve depolama doluluk göstergesi.
- Dar ekranda bilgi kartı.

### 1.2 Bu sürümde yok

Sticker Studio, PNG dışa aktarma, JSON yedek, telefon ve tablet desteği, sayfa temaları ve arka planları, yazı rengi seçimi, yazı için not kartı zemini, çoklu seçim, hizalama çizgileri, ayrıntılı katman yönetimi, bulut eşitleme, kullanıcı hesabı, "VIP" rozeti, bütün defteri silen "Sıfırla" butonu, masa süsleri.

Bu özellikler için arayüzde buton gösterme.

---

## 2. Teknoloji

| Konu | Karar |
|---|---|
| Kurulum | `create-vite` React şablonu (yapıldı). React 19, Vite 8 |
| Dil | JavaScript (JSX), TypeScript yok |
| Stil | Saf CSS, CSS değişkenleri |
| Durum | `useReducer` + undo geçmişi |
| Bağımlılık | Yalnızca `react`, `react-dom` |
| Test | `node --test` (ek paket yok). `package.json` içinde `"test": "node --test tests/"` |
| Kayıt | LocalStorage |
| Yayın | Netlify (build: `npm run build`, publish: `dist`) |
| Depo | GitHub, public |

---

## 3. Veri modeli

```js
Notebook = {
  schemaVersion: 1,
  pages: [Page],          // en az 1, en fazla 8
  updatedAt: 1731300000000
}

Page = {
  id: "pg_xxx",
  title: "Sayfa 1",       // en fazla 40 karakter
  items: [Item]           // dizi sırası = katman sırası, son eleman en üstte
}

Item = {
  id: "it_xxx",
  type: "photo" | "sticker" | "decoration" | "text",
  x: 400, y: 500,         // merkez noktası, sayfa birimi
  w: 240, h: 290,         // sayfa birimi
  rotation: -3,           // derece
  props: { ... }
}
```

| type | props |
|---|---|
| `photo` | `src` (sıkıştırılmış JPEG data URL), `caption` (en fazla 40 karakter, boş olabilir) |
| `sticker` | `stickerId` |
| `decoration` | `decorationId` |
| `text` | `content`, `font: "hand" \| "serif" \| "typewriter"`, `size` (14–72), `bold`, `italic`, `align: "left" \| "center" \| "right"` |

Yazı nesnesinde `w` kullanıcının verdiği kutu genişliğidir. `h` yazının gerçek yüksekliğidir. Bileşen bu yüksekliği DOM'dan ölçer. Ölçülen yükseklik düzenleme bitince, bir yazı özelliği değişince ya da genişlik değişince ayrı bir `item/measure` eylemiyle reducer'a gider. Reducer yüksekliği yazar ve nesneyi sayfanın içine geri iter. `item/measure` yeni bir undo adımı açmaz (bölüm 7.4).

### 3.1 Koordinatlar

- Her sayfa 800 × 1000 sayfa birimidir. Ekrandaki boyut CSS ile ölçeklenir.
- Ekrandaki fare konumunu `screenToPage()` fonksiyonu sayfa birimine çevirir.
- Nesneler kendi sayfalarının içinde kalır. Döndürülmüş nesnenin kapladığı dikdörtgen sayfa sınırını geçemez. Kullanıcı nesneyi kenara sürüklerse nesne kenarda durur.
- Bir nesne başka bir sayfaya taşınmaz.
- En küçük nesne boyutu 40 × 40 birimdir. Bir nesne sayfadan büyük olamaz.

### 3.2 Sayfa yerleşimi

- Açık defterde sol sayfa `pages[2k]`, sağ sayfa `pages[2k+1]` olur.
- Sayfa sayısı tekse son açık defterin sağ yüzü boş görünür. Boş yüzde "+ Sayfa ekle" butonu bulunur.
- İlk açılışta defterde iki boş sayfa vardır: "Sayfa 1" ve "Sayfa 2".

---

## 4. Kayıt

### 4.1 LocalStorage anahtarları

| Anahtar | İçerik |
|---|---|
| `ad:notebook:v1` | Notebook nesnesi (JSON) |
| `ad:prefs` | `{ spreadIndex, panelTab }` |

### 4.2 Otomatik kayıt

- Notebook her değiştiğinde uygulama 600 ms bekler, sonra kaydeder (debounce).
- Kayıt durumu üst çubukta görünür: `Kaydedilmemiş değişiklik` → `Kaydediliyor…` → `Kaydedildi`.
- Undo geçmişi ve seçili nesne kaydedilmez.
- Açılışta uygulama kaydı okur ve doğrular. Doğrulama esnektir:
  - Kayıt yalnızca okunamıyorsa bozuktur: JSON hatası, `pages` dizisi yok ya da `schemaVersion` tanınmıyor (1 değil ya da eksik).
  - Eksik alanlar varsayılan değerlerle tamamlanır. Örnek: başlık yoksa "Sayfa N", `items` yoksa boş dizi, `caption` yoksa boş metin, yazı ayarı yoksa varsayılan ayar.
  - Tanınmayan türdeki bir nesne atlanır ve ayrıntı konsola yazılır. Kaydın geri kalanı açılır.
  - Eksik ya da tekrar eden id yerine yeni id üretilir. `pages` boşsa bir boş sayfa eklenir.
  - Amaç: geliştirme sırasında veri yapısı değişince eski kayıtlar silinmez ve bozuk sayılmaz.
- Kayıt bozuksa uygulama boş defterle açılır ve bozuk veriyi `ad:notebook:corrupt` anahtarına taşır. Kullanıcı bir uyarı görür.
- Yalnızca tek bir `ad:notebook:corrupt` anahtarı vardır. Yeni bozuk veri eski bozuk verinin üzerine yazılır. Zaman damgalı birden çok anahtar kullanılmaz, çünkü yer kaplar. Bu anahtar doluluk hesabına dahildir.

### 4.3 Depolama sınırı

LocalStorage yaklaşık 5 milyon karakter saklar. Fotoğraflar bu alanın büyük kısmını kullanır.

- Kapasite sabit 5.000.000 karakter kabul edilir. Doluluk, `ad:` ile başlayan bütün anahtarların uzunluğundan (anahtar adı + değer) hesaplanır.
- Panelin altında bir doluluk göstergesi bulunur: "Depolama: %35".
- Doluluk %80'i geçince gösterge eskitilmiş altın rengine döner ve bir uyarı görünür.
- Yeni fotoğraf eklemek doluluğu %90'ın üstüne çıkaracaksa uygulama fotoğrafı eklemez. Mesaj: "Depolama alanı dolmak üzere. Yeni fotoğraf eklemek için önce bir fotoğrafı sil."
- Kayıt sırasında `QuotaExceededError` oluşursa durum `Kaydedilemedi` olur. Uygulama ekrandaki veriyi silmez. Mesaj: "Değişiklik kaydedilemedi, depolama alanı dolu. Bir fotoğrafı silip tekrar dene."

### 4.4 Birden çok sekme

- Uygulama `storage` olayını dinler. Bu olay yalnızca başka bir sekme LocalStorage'a yazınca gelir.
- `ad:notebook:v1` başka bir sekmede değişirse bu sekmede otomatik kayıt durur. Bekleyen kayıt da yazılmaz. Kayıt durumu `Kayıt durduruldu` olur.
- Ekranda kapanmayan bir uyarı görünür: "Defterin başka bir sekmede değişti. Kaybı önlemek için bu sekmeyi yenile." Uyarıda bir "Yenile" butonu vardır. Buton sayfayı yeniler.
- İki sekmenin değişiklikleri birleştirilmez.

---

## 5. Fotoğraf

- Kullanıcı alt araç çubuğundaki "Fotoğraf ekle" butonuyla bir dosya seçer.
- Kabul edilen türler: PNG, JPG, JPEG, WEBP. Türü MIME türünden kontrol et.
- En büyük girdi dosyası: 15 MB.
- Uygulama fotoğrafı uzun kenarı 600 piksel olacak şekilde küçültür ve JPEG'e çevirir (kalite 0.75). Sonuç 80 KB'ı geçerse kaliteyi 0.6 ile tekrar dener.
- Sayfa başına en fazla 3 fotoğraf. Sınıra ulaşan sayfada buton pasif olur ve ipucu gösterir: "Bu sayfada en fazla 3 fotoğraf olabilir."
- Fotoğraf her zaman polaroid çerçevede görünür. Çerçevenin alt kısmı daha geniştir.
- Polaroid notu (caption) el yazısı fontuyla görünür. Kullanıcı notu Özellikler panelinden yazar.
- İşlem sırasında butonda bir yükleniyor göstergesi görünür.

Hata mesajları:

| Durum | Mesaj |
|---|---|
| Desteklenmeyen tür | "Bu dosya türü desteklenmiyor. PNG, JPG ya da WEBP seç." |
| 15 MB üstü | "Bu fotoğraf 15 MB'tan büyük. Daha küçük bir dosya seç." |
| Okuma hatası | "Fotoğraf açılamadı. Başka bir dosya dene." |

---

## 6. Ekran yerleşimi

Uygulama en az 1024 piksel genişlik için tasarlanır. Daha dar ekranda uygulama yalnızca bir bilgi kartı gösterir: "Anı Defterim bilgisayar ekranı için tasarlandı. Lütfen bir bilgisayardan aç."

### 6.1 Üst çubuk

- Koyu zemin.
- Sol: "Anı Defterim" logosu, küçük bir taç ikonu, slogan "Burası benim krallığım".
- Orta: kayıt durumu.
- Sağ: Geri al, Yinele.

### 6.2 Defter

- Ekranın ana odağı açık defterdir.
- Kağıt tonu, çok hafif noktalı grid, ortada cilt gölgesi, hafif yuvarlak köşeler.
- Her sayfanın üstünde sayfa başlığı vardır. Kullanıcı başlığa tıklayıp yerinde düzenler. Başlık boş bırakılırsa "Sayfa N" olur.
- Sabit süsler: sol sayfanın altında "Anı Defterim", sağ sayfanın altında "Burası benim krallığım" yazar. Sağ sayfanın üst kenarında lavanta bir ayraç şeridi bulunur. Bunlar yalnızca CSS ile yapılır. Nesne değildir, seçilmez, kaydedilmez.
- Son tıklanan sayfa **aktif sayfa** olur. Açık defter değişince aktif sayfa yeni açık defterin sol sayfası olur. Aktif sayfanın kenarında çok hafif bir lavanta parıltısı görünür. Yeni nesneler aktif sayfaya eklenir.
- Boş sayfanın ortasında soluk, el yazısıyla bir ipucu görünür: "Panelden bir fotoğraf, çıkartma ya da not ekle →". Sayfaya ilk nesne eklenince ipucu kaybolur.

### 6.3 Sayfa çubuğu (defterin altında)

`‹ Önceki` · "Sayfa 3–4 / 6" · `Sonraki ›` · `+ Sayfa ekle` · `Sayfayı sil`

- "Sayfayı sil" aktif sayfayı siler. Önce onay ister: "“{başlık}” sayfası ve üzerindeki her şey silinecek. Emin misin?"
- Tek sayfa kaldıysa "Sayfayı sil" pasiftir.
- 8 sayfaya ulaşınca "+ Sayfa ekle" pasiftir. İpucu: "En fazla 8 sayfa olabilir."
- Açık defterler arasında geçişte kısa bir solma animasyonu kullanılır (300 ms).

### 6.4 Alt araç çubuğu

Yüzen, yuvarlak köşeli bir cam çubuk. Sayfa çubuğunun altında, ortada durur. Defterin üstüne binmez. Silme butonları `--danger` rengini kullanır.

| Buton | Eylem |
|---|---|
| Fotoğraf ekle | Dosya seçiciyi açar |
| Çıkartma | Paneli Çıkartmalar sekmesine geçirir |
| Süs | Paneli Süsler sekmesine geçirir |
| Yazı ekle | Aktif sayfaya "Notunu yaz…" yazılı bir yazı nesnesi ekler ve düzenleme modunda açar |
| Seçileni sil | Seçili nesneyi siler. Seçim yoksa pasiftir. |

### 6.5 Sağ panel

Koyu cam görünümlü dikey panel. Üç sekme: **Çıkartmalar**, **Süsler** ve **Özellikler**.

- Kullanıcı bir çıkartmaya ya da süse tıklar. Uygulama onu aktif sayfanın ortasına, −4° ile +4° arası rastgele bir açıyla ekler ve seçer.
- Açık sekme ayrı bir durumdur: `panelTab` (`stickers`, `decorations` ya da `properties`). Son kütüphane sekmesi de ayrı tutulur: `lastLibraryTab`.
- Seçili nesne yokken Özellikler sekmesi pasiftir.
- Bir nesne seçilince `panelTab` `properties` olur.
- Seçim kalkınca `panelTab` `lastLibraryTab` değerine döner.
- Kullanıcı bir kütüphane sekmesine ya da araç çubuğundaki Çıkartma/Süs butonuna basarsa o sekme açılır. Seçim durur. `lastLibraryTab` güncellenir. Nesne seçiliyken de kütüphane sekmeleri tıklanabilir.
- Seçim dururken kullanıcı Özellikler sekmesine basarak geri döner.
- `ad:prefs` içindeki `panelTab` alanı `lastLibraryTab` değerini (`stickers` ya da `decorations`) tutar. Seçim kaydedilmediği için `properties` kaydedilmez.

Özellikler sekmesi:

| Nesne | Ayarlar |
|---|---|
| Hepsi | Nesne türü etiketi, Döndürme kaydırıcısı (−180° ile +180°), Öne getir, Arkaya gönder, Sil |
| Fotoğraf | Not (en fazla 40 karakter) |
| Yazı | Yazı tipi (El yazısı / Serif / Daktilo), Boyut (14–72), Kalın, İtalik, Hizalama (sol / orta / sağ) |

---

## 7. Editör

### 7.1 Seçim ve dönüştürme

- Tıklama nesneyi seçer. Sayfanın boş alanına tıklama seçimi kaldırır.
- Seçili nesnede ince bir seçim çerçevesi, sağ alt köşede bir boyutlandırma tutamacı ve üstte bir döndürme tutamacı görünür.
- Fotoğraf, çıkartma ve süs boyutlanırken oranlarını korur.
- Yazı nesnesinde tutamaç kutunun genişliğini değiştirir. Yazı yeni genişliğe göre satır kırar.
- Döndürme `Shift` basılıyken 15° adımlarla yapılır.
- Özellikler sekmesindeki döndürme kaydırıcısı tutamaçlara ek bir yoldur. Tutamaçlar kalır. Kaydırıcı sürüklenirken ara açılar bileşenin yerel durumunda tutulur. Kaydırıcı bırakılınca reducer'a tek eylem gider.
- "Öne getir" nesneyi `items` dizisinin sonuna, "Arkaya gönder" dizinin başına taşır.
- Bütün etkileşimleri Pointer Events ile yaz. `setPointerCapture` kullan.

### 7.2 Yazı düzenleme

- Yazı nesnesine çift tıklama düzenleme modunu açar.
- Kullanıcı düzenleme modundan `Esc` ile ya da nesnenin dışına tıklayarak çıkar.
- Düzenleme bitince içerik reducer'a tek bir eylem olarak gider.
- İçerik boş kalırsa nesne silinir.

### 7.3 Klavye

| Tuş | Eylem |
|---|---|
| Delete / Backspace | Seçili nesneyi sil |
| Ctrl/Cmd + Z | Geri al |
| Ctrl/Cmd + Y, Ctrl/Cmd + Shift + Z | Yinele |
| Esc | Seçimi kaldır ya da yazı düzenlemeden çık |

Kullanıcı bir yazı alanına yazarken bu kısayollar çalışmaz.

### 7.4 Undo / Redo

- Reducer durumu `{ past, present, future }` biçimindedir.
- Her tamamlanmış eylem bir adımdır: nesne ekleme, silme, taşıma bitişi, boyutlandırma bitişi, döndürme bitişi (tutamaç ya da kaydırıcı), öne getirme, arkaya gönderme, özellik değişikliği, sayfa ekleme, sayfa silme, başlık değişikliği.
- Yazı yüksekliğini bildiren `item/measure` eylemi yeni adım açmaz. Yalnızca `present` durumunu günceller. `past` ve `future` değişmez. Böylece kullanıcının tek değişikliği tek undo adımı olur. Undo sonrası gelen bir ölçüm Yinele geçmişini silmez.
- En fazla 30 adım. Geçmiş sayfa yenilenince sıfırlanır.
- Hangi açık defterin görüntülendiği ve hangi nesnenin seçili olduğu geçmişe girmez.
- Notebook her değiştiğinde (undo ve redo dahil) uygulama `selectedItemId`, `editingItemId`, `activePageId` ve `lastChangedPageId` referanslarını kontrol eder. Var olmayan bir sayfayı ya da nesneyi gösteren referans temizlenir.
- Aktif sayfa silinirse aktif sayfa aynı sıradaki sayfa olur. O sıra artık yoksa son sayfa olur. Uygulama bu sayfanın açık defterine geçer.
- Açılışta `ad:prefs` içindeki `spreadIndex` sayfa sayısına göre sınırlanır.
- Undo ile değişen nesne başka bir sayfadaysa uygulama o sayfanın açık defterine geçer.
- Geri al ve Yinele butonları kullanılamadıkları zaman pasif görünür.

---

## 8. Hazır içerik

### 8.1 Çıkartmalar (7)

Çıkartmalar vintage estetiğindedir. Panelde grup başlığı olmadan tek bir ızgarada görünür.

| id | Çıkartma | Tarif |
|---|---|---|
| `coffee` | Kahve | Tabağıyla birlikte bir kahve fincanı, üstünde ince buhar çizgileri |
| `star` | Yıldız | Tek, büyük, dört köşeli yıldız |
| `cactus` | Kaktüs | Küçük toprak saksıda yuvarlak bir kaktüs |
| `bow` | Fiyonk | İki kuyruklu bir fiyonk |
| `deer` | Geyik | Yandan görünen, boynuzlu bir geyik. İnce çizgi illüstrasyon |
| `fairy-lights` | LED ışık | Hafif sarkan bir tel üzerinde 6-8 küçük ampul (peri ışıkları) |
| `books` | Kitap | Üç kitaptan oluşan bir yığın |

Çıkartmaların çevresinde krem renkli (`--accent-cream`) ince bir kesim kenarı bulunur. Bu kenar gerçek bir çıkartma etiketi hissi verir.

### 8.2 Süsler (4 tür, 6 çizim)

Süslerde kesim kenarı yoktur.

| id | Süs | Tarif |
|---|---|---|
| `stamp` | Pul | Tırtıklı kenarlı bir posta pulu. İçinde küçük, sade bir dal çizimi |
| `washi-plain` | Washi tape | Düz renkli, kenarları hafif yırtık kağıt bant |
| `washi-grid` | Washi tape | Kareli desenli kağıt bant |
| `washi-dots` | Washi tape | Noktalı desenli kağıt bant |
| `clear-tape` | Bant | Yarı saydam selobant parçası. Opaklık yaklaşık 0.45. Altındaki fotoğraf görünür |
| `sparkle` | Işıltı | 3-5 küçük, farklı boyutlu parıltıdan oluşan bir küme |

Yıldız ile ışıltı farklıdır. Yıldız tek ve büyük bir çizimdir. Işıltı küçük parıltılardan oluşan bir kümedir.

Washi tape ve bant, fotoğrafın köşesine yapıştırılmış gibi görünmek için tasarlanır. Kullanıcı bunları fotoğrafın üstüne yerleştirir ve "Öne getir" ile fotoğrafın üstüne alır.

### 8.3 Çizim kuralları

- Her çizim `src/assets/stickers/` altında ayrı bir SVG dosyasıdır.
- Çizimler yalnızca bölüm 9.1'deki renkleri kullanır: projenin paleti ve eskitilmiş kahverengi tonlar.
- Kontur ince ve hafif düzensizdir (el çizimi hissi). Dolgu düzdür. Renkler hafif soluktur. Gerçekçi gölge ve gradyan kullanma.
- Her SVG'de `viewBox` vardır. SVG dış dosyaya, fonta ya da görsele bağlanmaz.
- `src/data/stickers.js` her çizimin `id`, `kind` (`sticker` ya da `decoration`), `label`, `src` ve varsayılan boyutunu tutar.
- Çizimleri 3 partide üret. Her partiden sonra dur. Ben onaylamadan sonraki partiye geçme.
  1. Kahve, kitap, yıldız, ışıltı
  2. Kaktüs, fiyonk, geyik, LED ışık
  3. Pul, üç washi tape, bant

### 8.4 Yazı tipleri

- Üç font: bir el yazısı, bir serif, bir daktilo fontu.
- Fontlar açık lisanslı (OFL) ve `src/assets/fonts/` altında yerel `ttf` dosyası olmalı. Kaynak google/fonts deposudur. Bu depoda `woff2` yok, `ttf` var. Dönüştürme için araç ya da paket kurulmaz.
  - El yazısı: Caveat (değişken font). İtalik dosyası yoktur. `italic` değeri kayıtta korunur, ama yazı tipi El yazısı iken uygulanmaz. Bu durumda İtalik butonu pasiftir. Kullanıcı başka bir fonta geçince italik yeniden uygulanır. Tarayıcının yapay eğiklik üretmemesi için bu fontta `font-synthesis: style none` kullanılır.
  - Serif: Lora (değişken font + italik dosyası).
  - Daktilo: Courier Prime (normal, kalın, italik, kalın italik).
- Fontlar Türkçe karakterleri göstermeli. Test cümlesi: `Ilık şömine, güzel çay, İstanbul, ĞÜŞİÖÇ`. Bir karakter yedek fonta düşüyorsa o fontu değiştir.
- Font lisanslarını README'ye yaz.

---

## 9. Görsel tasarım

### 9.1 Renkler

```css
--bg-deep: #101512;      --bg-forest: #18231D;   --bg-surface: #202922;
--accent-lavender: #B6A0D4;  --accent-sage: #A7B69B;
--accent-cream: #E8DDCC;     --accent-gold: #C6A775;
--paper: #E9E1D5;        --paper-shade: #DCD0C0; --ink: #302B27;

/* Yalnızca silme butonları için. --bg-deep üzerinde kontrast yaklaşık 5.1:1 */
--danger: #C27064;

/* Yalnızca çıkartma ve süs çizimleri için eskitilmiş kahverengi tonlar */
--vintage-umber: #6B4F3A;    --vintage-sepia: #8C6E52;   --vintage-tan: #B89A78;
```

Bütün yazı nesneleri `--ink` rengindedir.

### 9.2 Atmosfer

- Arka plan düz siyah değil. Karanlık bir odadaki çalışma masasını andırır.
- Mor ve yeşil LED yansımalarını `radial-gradient` katmanlarıyla yap. Işık katmanlarının opaklığı 0.18'i geçmez.
- Işıklar çok yavaş hareket eder (bir döngü en az 20 saniye). `prefers-reduced-motion` açıksa hareket durur.
- Paneller koyu cam görünümündedir: `backdrop-filter: blur()` en fazla 16 px, ince bir kenar parıltısı.
- Defterin çevresinde katmanlı, gerçekçi bir gölge bulunur.
- Kağıt dokusunu SVG `feTurbulence` ile üret. Dış görsel dosyası kullanma.
- Masa süsleri (kedi, kitap, fener, sarmaşık) yok. Ay ve hilal motifi yok.
- Koyu zemin üzerindeki yazıların kontrastı en az 4.5:1 olmalı.

### 9.3 Referans görsel

Referans görsel bir yapay zekâ aracıyla üretildi.

Referans görselden şunları al: koyu üst çubuk düzeni, defterin ekrandaki ağırlığı, sağda üç sekmeli dikey cam panel, defterin altında sayfa çubuğu ve onun altında yüzen araç çubuğu, polaroid ile washi tape ilişkisi, kesik çizgili lavanta seçim çerçevesi, sayfa altı yazıları ve ayraç şeridi.

Şunları alma: görseldeki fotoğraflar ve çizimler, "VIP" rozeti, "Sıfırla" butonu, yazının not kartı zemini, sayfadaki kalp ikonu.

---

## 10. Aşamalar

Her aşamanın bir "Bitti" tanımı var. Bitti tanımındaki her madde sağlanmadan aşama bitmez. Aşama sonunda Claude durur.

### Aşama 0 — Plan (yarım gün, kod yok)

- SPEC'i ve DECISIONS'ı oku. Mevcut klasörü incele. Hiçbir dosyayı silme.
- `docs/PLAN.md` dosyasını yaz: bileşen ağacı, reducer eylemleri listesi, riskler, aşama başına dosya listesi.
- SPEC'te belirsiz bulduğun noktalar için bana en fazla 5 soru sor. Her soruya bir varsayılan cevap öner.

**Bitti:** PLAN.md var. Sorular cevaplandı.

### Aşama 1 — Kurulum ve görsel iskelet (1-2 gün)

- Şablonun demo sayfasını kaldırma (kurulum hazır, tekrar kurma), klasör yapısı, `npm test` betiği.
- Renk değişkenleri, LED arka plan, defter, sayfa başlıkları, sağ panel, alt araç çubuğu, sayfa çubuğu, üst çubuk.
- Yerel fontlar.
- Dar ekran bilgi kartı.
- Netlify'a ilk yayın.

**Bitti:** 1440 px ve 1024 px genişlikte yerleşim bozulmuyor. 800 px genişlikte bilgi kartı görünüyor. Canlı bağlantı açılıyor. Henüz işlevi olmayan butonlar pasif görünüyor.

### Aşama 2 — Veri ve kayıt (1-2 gün)

- `model.js`, `notebookReducer.js`, `history.js`, `storage.js`.
- Sayfa ekleme, silme, başlık, önceki/sonraki.
- Otomatik kayıt, kayıt durumu, doluluk göstergesi, bozuk kayıt koruması, esnek doğrulama.
- Birden çok sekme uyarısı (bölüm 4.4).
- Geçersiz referans temizliği (bölüm 7.4).
- Geri al / Yinele (sayfa eylemleri için).

**Bitti:** 5 sayfa ekle, başlık ver, birini sil, sayfayı yenile. Bütün sayfalar ve başlıklar geri geliyor. Reducer ve storage testleri geçiyor.

### Aşama 3 — Editör (2-3 gün)

- Nesne bileşenleri (bu aşamada çıkartma yerine basit yer tutucu şekiller kullan).
- Seçme, taşıma, boyutlandırma, döndürme, sayfa sınırı, öne getirme, silme.
- Yazı nesnesi ve Özellikler paneli.
- Klavye kısayolları. Bütün editör eylemleri için Undo/Redo.

**Bitti:** Bölüm 7'deki her eylem çalışıyor. Yenileme sonrası nesneler aynı konumda, boyutta ve açıda. `geometry.test.js` geçiyor.

### Aşama 4 — İçerik (1-2 gün)

- Fotoğraf yükleme, sıkıştırma, polaroid, not, sınırlar ve hata mesajları.
- 7 çıkartma ve 6 süs çizimi, 3 partide (bölüm 8.3).

**Bitti:** 3 fotoğraflı bir sayfa yenilemeden sonra aynen geliyor. Bütün çıkartmalar onaylandı. Depolama göstergesi fotoğraf ekleyince artıyor.

### Aşama 5 — Temizlik ve teslim (1 gün)

- code-simplifier ile sadeleştirme. Kullanılmayan kod ve konsol çıktıları temizliği.
- `README.md`:
  - proje açıklaması
  - en az 1 ekran görüntüsü (`docs/screenshots/`)
  - kurulum adımları (`npm install`, `npm run dev`, `npm run build`)
  - kullanılan teknolojiler ve font lisansları
  - yapay zekânın hangi aşamada nasıl kullanıldığı (`docs/AI-LOG.md` kaynaklı)
  - bilinen sınırlar (bölüm 12)
  - canlı bağlantı
- Son yayın.

**Bitti:** Canlı bağlantıda bölüm 11'deki bütün testler geçiyor. GitHub deposu public.

---

## 11. Kabul testleri

Ben bu testleri elle yaparım. Claude her aşamada ilgili maddeleri `docs/TEST-CHECKLIST.md` dosyasına adım adım yazar.

| # | Test | Aşama |
|---|---|---|
| 1 | 1440 ve 1024 px genişlikte yerleşim düzgün. 800 px'te bilgi kartı var | 1 |
| 2 | Sayfa ekle, başlık ver, sil (onay çıkıyor). 8 sayfa sınırı çalışıyor | 2 |
| 3 | Sayfayı yenile: sayfalar, başlıklar ve açık defter korunuyor | 2 |
| 4 | Kayıt durumu üç hâli doğru gösteriyor | 2 |
| 5 | LocalStorage'daki kaydı elle boz, sayfayı yenile: uygulama çökmüyor, uyarı veriyor | 2 |
| 6 | Nesneyi taşı, boyutlandır, döndür. Nesne sayfa dışına çıkmıyor | 3 |
| 7 | Yazı ekle, düzenle. Font, boyut, kalın, italik, hizalama değişiyor | 3 |
| 8 | 5 eylem yap, 5 kez geri al, 5 kez yinele. Durum doğru | 3 |
| 9 | Delete tuşu ve "Seçileni sil" çalışıyor. Yazı yazarken Delete nesneyi silmiyor | 3 |
| 10 | 3 fotoğraf ekle, 4.'sü engelleniyor. Polaroid notu görünüyor | 4 |
| 11 | `.gif` dosyası ve 20 MB'lık dosya anlaşılır hata veriyor | 4 |
| 12 | Bütün içerikle sayfayı yenile: her şey aynı | 4 |
| 13 | Bütün akış boyunca DevTools konsolunda hiçbir hata yok | 5 |
| 14 | Canlı bağlantıda 1–13 tekrar geçiyor | 5 |

Bir test geçmezse o özelliği "tamamlandı" olarak işaretleme.

---

## 12. Bilinen sınırlar (README'ye yazılır)

- Defter yalnızca kullanıldığı tarayıcıda saklanır. Başka bir cihaz ya da tarayıcı defteri görmez.
- Tarayıcı verisini silmek defteri siler.
- Fotoğraflar yer kazanmak için küçültülür. Baskı kalitesinde değildir.
- Uygulama yalnızca bilgisayar ekranı için tasarlandı.
- Defter aynı anda yalnızca bir sekmede düzenlenmeli. Defter başka bir sekmede değişirse uygulama bu sekmede kaydı durdurur ve yenilemeyi ister. İki sekmenin değişiklikleri birleştirilmez.

---

## 13. Dosya yapısı

```
claude-project/           (klasör adı değişmez, package.json adı: ani-defterim)
├── index.html
├── netlify.toml
├── package.json
├── vite.config.js
├── CLAUDE.md
├── README.md
├── docs/
│   ├── SPEC.md  DECISIONS.md  PLAN.md  TEST-CHECKLIST.md  AI-LOG.md
│   └── screenshots/
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── state/              saf JS, JSX yok
│   │   ├── model.js            sayfa ve nesne oluşturma, id üretme, doğrulama
│   │   ├── notebookReducer.js  bütün veri değişiklikleri
│   │   ├── history.js          undo / redo sarmalayıcısı
│   │   └── storage.js          okuma, yazma, doluluk hesabı
│   │                           (localStorage'ı parametre olarak alır, testte sahte nesne verilir)
│   ├── lib/
│   │   ├── geometry.js         saf JS: döndürülmüş kutu, sınır, koordinat çevirme
│   │   └── imageCompress.js    tarayıcıda fotoğraf küçültme
│   ├── hooks/
│   │   ├── useAutosave.js
│   │   ├── useItemTransform.js
│   │   └── useKeyboardShortcuts.js
│   ├── components/
│   │   ├── TopBar.jsx  SaveStatus.jsx
│   │   ├── Notebook.jsx  Page.jsx  PageBar.jsx
│   │   ├── items/  ItemFrame.jsx  PhotoItem.jsx  StickerItem.jsx  DecorationItem.jsx  TextItem.jsx
│   │   ├── panel/  SidePanel.jsx  StickerLibrary.jsx  PropertiesPanel.jsx  StorageMeter.jsx
│   │   ├── Toolbar.jsx  Toast.jsx  ConfirmDialog.jsx  NarrowScreenNotice.jsx
│   ├── data/stickers.js
│   ├── assets/  stickers/  fonts/
│   └── styles/  tokens.css  base.css  (bileşen başına bir CSS dosyası)
└── tests/
    ├── notebookReducer.test.js
    ├── history.test.js
    ├── storage.test.js
    └── geometry.test.js
```
