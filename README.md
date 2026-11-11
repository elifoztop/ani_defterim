# Anı Defterim

> Burası benim krallığım.

Anı Defterim, bilgisayar tarayıcısında çalışan bir dijital scrapbook defteridir. Defterin sayfalarına fotoğraf, çıkartma, süs ve yazı yerleştirirsin. Uygulama her değişikliği tarayıcıya kendisi kaydeder; sayfayı kapatıp açınca defterini aynen bulursun.

Bu proje bir web geliştirme eğitim programının bitirme projesidir ve "Web Geliştirme; Yapay Zeka Proje Yönergesi" kurallarına göre hazırlanmıştır.

**Canlı bağlantı:** https://ani-defterim.netlify.app
**Depo:** https://github.com/elifoztop/ani_defterim

![Anı Defterim ekran görüntüsü](<docs/Anı Defterim_ Pastel Dijital Günlük.png>)

## Özellikler

- Açık defter görünümü: yan yana iki sayfa, sayfa başlıkları, önceki/sonraki gezinme.
- Sayfa ekleme, silme (onaylı) ve yerinde başlık düzenleme. En fazla 8 sayfa.
- Dört nesne türü: polaroid çerçeveli fotoğraf, çıkartma, süs ve yazı.
- Nesneleri seçme, taşıma, boyutlandırma, döndürme (Shift ile 15° adım), öne getirme, arkaya gönderme ve silme. Nesneler defterin dışına çıkmaz.
- Nesneyi açık defterdeki karşı sayfaya sürükleyip taşıma. Bir nesne her zaman tek bir sayfaya aittir.
- Açık defterler arasında sayfa çevirme animasyonu.
- Yazı ayarları: el yazısı, serif ve daktilo fontu; boyut, kalın, italik, hizalama.
- Geri al / Yinele (30 adım) ve klavye kısayolları: Delete, Ctrl+Z, Ctrl+Y, Esc.
- Otomatik kayıt (LocalStorage), kayıt durumu ve depolama doluluk göstergesi.
- Bozuk kayıt koruması ve aynı defter iki sekmede açıldığında uyarı.
- 7 çıkartma ve 6 süs çizimi (SVG, projenin kendi paletiyle).

## Kurulum

Gerekenler: Node.js 20.19 ya da üstü (Vite 8 için) ve npm.

```bash
npm install
npm run dev
```

Tarayıcıda terminalde yazan adresi aç (genellikle http://localhost:5173). Uygulama en az 1024 piksel genişlikte bir ekran için tasarlandı.

### Komutlar

| Komut | İş |
|---|---|
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | `dist/` klasörüne üretim derlemesi |
| `npm run preview` | `dist/` klasörünü yerelde sunar |
| `npm run lint` | ESLint |
| `npm test` | Birim testleri (`node --test tests/`) |

Yayın: Netlify, GitHub deposundaki `main` dalını `netlify.toml` ayarlarıyla derler (`npm run build`, yayın klasörü `dist`).

## Kullanılan teknolojiler

- **React 19** (`useReducer`, `useEffectEvent`) ve **Vite 8**. Çalışma zamanı bağımlılığı yalnızca `react` ve `react-dom`.
- **Saf CSS** ve CSS değişkenleri; ölçeklenen defter için CSS container birimleri.
- **Pointer Events** ve `setPointerCapture` ile sürükleme, boyutlandırma ve döndürme.
- **LocalStorage** ile kayıt. Sunucu ya da veritabanı yok.
- **Testler:** Node'un yerleşik `node:test` ve `node:assert` modülleri. Durum, geometri, kayıt ve fotoğraf kuralları saf JavaScript olduğu için tarayıcı olmadan test edilir.
- **ESLint** (React Hooks ve React Refresh kuralları).

### Yapı

```
src/state/       saf JS: veri modeli, reducer'lar, geri al geçmişi, LocalStorage
src/lib/         saf JS geometri, yazı stili, fotoğraf kuralları; tarayıcıda fotoğraf küçültme
src/hooks/       otomatik kayıt, sekme uyarısı, sürükleme, klavye, yazı ölçümü, fotoğraf yükleme
src/components/  arayüz bileşenleri
src/assets/      yerel fontlar ve çıkartma çizimleri
tests/           birim testleri
docs/            SPEC, kararlar, plan, test listesi, yapay zekâ kaydı
```

## Fontlar ve lisanslar

Fontlar [google/fonts](https://github.com/google/fonts) deposundan alındı ve `src/assets/fonts/` altında yerel dosya olarak duruyor. Üçü de **SIL Open Font License 1.1** ile lisanslıdır; lisans metinleri fontların yanındadır.

| Font | Kullanım | Telif |
|---|---|---|
| Caveat | El yazısı, slogan, polaroid notu | Copyright 2014 The Caveat Project Authors — `OFL-Caveat.txt` |
| Lora | Serif yazı, logo, sayfa başlıkları | Copyright 2011 The Lora Project Authors, Reserved Font Name "Lora" — `OFL-Lora.txt` |
| Courier Prime | Daktilo yazı, sayfa sayacı | Copyright 2015 The Courier Prime Project Authors — `OFL-CourierPrime.txt` |

Çıkartma ve süs çizimleri bu proje için yapay zekâ yardımıyla üretildi (aşağıya bak). Dış görsel, ikon paketi ya da CDN kullanılmadı.

## Yapay zekâ kullanımı

Projenin her aşamasında yapay zekâ kullanıldı. Ayrıntılı kayıt [`docs/AI-LOG.md`](docs/AI-LOG.md) dosyasındadır; bütün kararlar ve gerekçeleri [`docs/DECISIONS.md`](docs/DECISIONS.md) dosyasındadır.

| Aşama | Yapay zekâ ne yaptı | Ben ne yaptım |
|---|---|---|
| Planlama | Claude (claude.ai) bana 9 tur soru sordu, ilk istemimle yönerge arasındaki çelişkiyi ve cevaplarımdaki çelişkileri gösterdi. SPEC, DECISIONS ve CLAUDE.md belgelerini yazdı. | Kapsamı, öncelikleri ve görsel tercihleri seçtim. |
| Referans görsel | Bir yapay zekâ görsel aracı yerleşim için referans tasarım üretti. | Görseldeki fotoğraf ve çizimler alınmadı; yalnızca yerleşim fikri kullanıldı. |
| Aşama 0 — Plan | Claude Code `docs/PLAN.md` dosyasını yazdı: bileşen ağacı, eylemler, riskler. | Planı inceleyip dört düzeltme ve iki ekleme istedim (ör. ayrı panel sekmesi durumu, esnek kayıt doğrulaması). |
| Aşama 1 — İskelet | Yerleşimi, LED arka planı, cam panelleri, yerel fontları ve dar ekran kartını yazdı. | Ayraç şeridinin sayfa başlığını kapattığını buldum ve düzelttirdim. GitHub ve Netlify yayınını yaptım. |
| Aşama 2 — Veri ve kayıt | Reducer'ları, geri al geçmişini, otomatik kaydı, bozuk kayıt korumasını ve sekme uyarısını yazdı. | Varsayılan sayfa başlıklarının silme sonrası tekrar ettiğini buldum ve kullanıcının verdiği başlıkları koruyan çözümü belirledim. |
| Aşama 3 — Editör | Geometri modülünü, taşıma/boyutlandırma/döndürmeyi, yazı düzenlemeyi, Özellikler panelini ve kısayolları yazdı. | Hızlı denemeyi yaptım. Çalışma biçimini hızlandırdım (otomatik commit, kısa deneme listesi). |
| Aşama 4 — İçerik | Fotoğraf küçültmeyi, polaroidi ve 13 SVG çizimi üretti; çizimleri önizlemede kontrol edip bozuk olanları düzeltti. | Çizimleri onayladım, fotoğraf ve sınırları denedim. |
| Aşama 5 — Teslim | code-simplifier ile sadeleştirme, README, ekran görüntüsü. | Canlı bağlantıda kabul testleri (bekliyor). |

Kullanılan araçlar: Claude (claude.ai), Claude Code, context7 eklentisi (React ve Pointer Events belgeleri), superpowers eklentisi, code-simplifier eklentisi.

## Bilinen sınırlar

- Defter yalnızca kullanıldığı tarayıcıda saklanır. Başka bir cihaz ya da tarayıcı defteri görmez.
- Tarayıcı verisini silmek defteri siler.
- Fotoğraflar yer kazanmak için küçültülür (uzun kenar 600 piksel). Baskı kalitesinde değildir.
- LocalStorage yaklaşık 5 milyon karakter tutar; bu yüzden sayfa başına en fazla 3 fotoğraf eklenebilir.
- Uygulama yalnızca bilgisayar ekranı için tasarlandı (en az 1024 piksel genişlik).
- Defter aynı anda yalnızca bir sekmede düzenlenmeli. Defter başka bir sekmede değişirse uygulama bu sekmede kaydı durdurur ve yenilemeyi ister. İki sekmenin değişiklikleri birleştirilmez.
- Başlığa elle tam olarak "Sayfa N" yazılırsa, bir sonraki açılışta bu başlık boş sayılır ve sayfanın sırası gösterilir.
