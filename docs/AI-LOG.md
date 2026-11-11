# Yapay Zekâ Kullanım Kaydı

Bu dosya, projenin hangi aşamasında yapay zekânın nasıl kullanıldığını kaydeder. README'deki yapay zekâ bölümü bu dosyadan hazırlanır.

## Planlama — Claude (claude.ai) ile soru-cevap (11 Kasım 2026)

- Yapay zekânın yaptığı:
  - İlk proje istemimi yönergeyle karşılaştırdı. Teknoloji seçiminde yönergeyle bir çelişki buldu: ilk istem React gibi çatıları yasaklıyordu, yönerge ise bir kütüphane ya da çatı istiyor.
  - Bana 9 tur halinde, her turda 2-3 soru sordu: süre, öncelik, kalıcılık, fotoğraf, sayfa kullanımı, editör hareketleri, cihaz, nesne türleri, yazı ayarları, ilk açılış, atmosfer, dil.
  - Cevaplarım arasındaki çelişkileri gösterdi. Örnek 1: İlk istemde Sticker Studio "en önemli özellik" idi, ama ben tek bir özellik seçerken kalıcı kaydı seçtim. Örnek 2: "Telefonda görüntüleme" isteğim, verinin yalnızca bir tarayıcıda durması kararıyla uyuşmuyordu.
  - Kararları `docs/DECISIONS.md`, ürün tanımını `docs/SPEC.md`, çalışma kurallarını `CLAUDE.md` olarak yazdı.
- Kullanılan eklenti / araç: Claude sohbet arayüzü
- Benim kontrol ettiğim ya da değiştirdiğim: (bunu ben doldururum)
- Bilinen eksikler: Yok. Geliştirme Aşama 0 ile başlayacak.

## Referans tasarım görseli (11 Kasım 2026)

- Yapay zekânın yaptığı: `docs/referans.png` dosyasındaki referans tasarım görselini bir yapay zekâ görsel üretme aracı üretti. Görsel yalnızca yerleşim fikri için kullanılır. Görseldeki fotoğraflar ve çizimler projeye kopyalanmaz.
- Kullanılan eklenti / araç: Yapay zekâ görsel üretme aracı
- Benim kontrol ettiğim ya da değiştirdiğim: (bunu ben doldururum)
- Bilinen eksikler: Görselde SPEC dışında kalan öğeler var: "VIP" rozeti, "Sıfırla" butonu, not kartı zemini, kalp ikonu. Bunlar alınmadı (DECISIONS 24, 27, 28).

## Aşama 0 — Plan (11 Kasım 2026)

- Yapay zekânın yaptığı:
  - SPEC, DECISIONS, `package.json`, ESLint yapılandırması ve mevcut klasörü inceledi. Hiçbir dosyayı silmedi, kod yazmadı.
  - İlk turda 5 soru sordu. Referans görsel iki kez güncellenince soruları yeniden yazdı: üst çubuk, sayfa başlığının yeri ve alt alan sorularını yeni görsel cevapladı. Yerlerine görseldeki SPEC dışı öğeler hakkında sorular sordu: "Sıfırla" butonu, üç sekmeli panel, döndürme kaydırıcısı ve "Arkaya gönder", not kartı görünümü, küçük süslemeler ve kırmızı sil rengi.
  - Cevaplara göre SPEC'i sürüm 4'e güncelledi ve DECISIONS'a 23–43 arası kararları ekledi.
  - `docs/PLAN.md` dosyasını yazdı: durumun nerede tutulduğu, bileşen ağacı, reducer eylemleri, saf mantık modülleri, 14 risk ve aşama başına dosya listesi.
- Kullanılan eklenti / komut: Claude Code (Read, Edit, Write, Grep), superpowers eklentisi
- Benim kontrol ettiğim ya da değiştirdiğim: (bunu ben doldururum)
  - PLAN incelemesinden sonra kullanıcının 4 düzeltmesini ve 2 eklemesini belgelere işledi: ayrı `panelTab` durumu, geçmişe yeni adım açmayan `item/measure`, geçersiz referans temizliği, esnek doğrulama, `storage` olayı uyarısı, Caveat'ta korunan ama uygulanmayan italik. Düzeltme 3'ü uygulamak için UI durumunu saf bir `uiReducer` içine aldı ve tek kök reducer önerdi (karar 46). DECISIONS'a 44–50 arası kararları ekledi, PLAN.md'yi yeniden yazdı.
- Bilinen eksikler: `npm test` betiği henüz yok, Aşama 1'de eklenecek. İki sekme maddesi SPEC 12'ye eklendi. README'ye Aşama 5'te geçecek.

## Aşama 1 — Kurulum ve görsel iskelet (11 Kasım 2026)

- Yapay zekânın yaptığı:
  - Şablonun demo dosyalarını sildi (`App.css`, `index.css`, `hero.png`, `react.svg`, `vite.svg`, `icons.svg`). Paket adını `ani-defterim` yaptı ve `npm test` betiğini ekledi. ESLint'e `tests/` için Node global'lerini ekledi. `netlify.toml`, taç ikonlu `favicon.svg` ve Türkçe `index.html` yazdı.
  - `src/state/constants.js` sabitlerini ve `tests/constants.test.js` testini yazdı.
  - Caveat, Lora ve Courier Prime fontlarını google/fonts deposundan TTF olarak indirdi ve OFL lisans dosyalarını yanına koydu. Yedi font dosyasının cmap tablosunu küçük bir Node betiğiyle okudu. Türkçe test cümlesinin bütün karakterlerinin her dosyada bulunduğunu doğruladı.
  - Renk değişkenlerini, LED arka planı (yavaş hareket, `prefers-reduced-motion` desteği), cam panelleri ve kağıt dokusunu (`feTurbulence`) saf CSS ile yazdı.
  - Bileşenleri yazdı: `TopBar`, `SaveStatus`, `Notebook`, `Page`, `PageTitle`, `EmptyFace`, `PageBar`, `Toolbar`, `SidePanel`, `StorageMeter`, `NarrowScreenNotice`, `Icon`. İşlevi olmayan bütün butonlar pasif.
  - DECISIONS'a 51–59 arası kararları ekledi.
- Kullanılan eklenti / komut: Claude Code (Bash, Read, Write, Edit), `curl` ile font indirme, `npm run build`, `npm run lint`, `npm test`. context7 eklentisi bu oturumda giriş istediği için kullanılamadı. Bu aşamada React 19'a özgü bir API ya da Pointer Events kullanılmadı. Yalnızca bileşen ve CSS yazıldı.
- Benim kontrol ettiğim ya da değiştirdiğim: Yerleşimi tarayıcıda referans görselle karşılaştırdım. Ayracın sağ sayfa başlığını kapattığını fark edip düzelttirdim. Projeyi GitHub'a gönderdim, Netlify'da yayına aldım ve herkese açık yaptım. Canlı adreste ekran boyutu testlerini yaptım.
- Depo: https://github.com/elifoztop/ani_defterim (public)
- Canlı adres: https://ani-defterim.netlify.app
- Bilinen eksikler:
  - Panel sekme geçişi, sayfa gezintisi ve bütün butonlar Aşama 2–4'te bağlanacak. `previewData.js` geçicidir, Aşama 2'de silinecek.
  - TTF dosyaları toplam yaklaşık 1,1 MB. `font-display: swap` sayesinde yazı hemen görünür, font sonra yüklenir.
- Elle test sonrası düzeltme:
  - Kullanıcı ayraç şeridinin sağ sayfanın başlığına bindiğini buldu. Claude sağ sayfanın başlık alanını sağ kenardan 150 birim önce bitirdi ve ayracı bu boşluğa taşıdı (karar 60). 40 karakterlik başlık `…` ile kesilir ve ayraca değmez.
  - SPEC 8.4 ve karar 32'deki geçersiz `font-synthesis: style none` yazımını `font-synthesis-style: none` olarak düzeltti.
