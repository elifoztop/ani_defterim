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

## Aşama 2 — Veri ve kayıt (11 Kasım 2026)

- Yapay zekânın yaptığı:
  - Saf JavaScript durum katmanını yazdı: `model.js` (sayfa oluşturma, id üretme, esnek doğrulama `normalizeNotebook`), `notebookReducer.js` (sayfa ekleme, silme, başlık), `history.js` (30 adımlı undo/redo, `item/measure` için geçmişe adım açmayan birleştirme kuralı), `uiReducer.js` (açık defter, aktif sayfa, panel sekmesi, `reconcileUi`), `appReducer.js` (kök reducer), `storage.js` (okuma, yazma, bozuk kaydın tek yedek anahtara taşınması, tercihler, doluluk, kota hatası, testler için bellek deposu).
  - Hook'ları yazdı: `useAutosave` (600 ms bekleme, `pagehide` anında kayıt, durdurma), `useCrossTabGuard` (`storage` olayı), `usePrefs`.
  - Kaydı React render etmeden önce bir kez okuyan `src/lib/boot.js` dosyasını ve Türkçe mesajları tutan `src/lib/messages.js` dosyasını ekledi.
  - Bileşenleri bağladı: sayfa ekleme/silme/gezinme, yerinde başlık düzenleme, Geri al/Yinele, beş hâlli kayıt durumu, doluluk göstergesi ve %80 uyarısı, panel sekmeleri. Yeni bileşenler: `ConfirmDialog`, `Toast`, `StaleTabNotice`.
  - `previewData.js` geçici dosyasını sildi (karar 56).
  - 6 test dosyası yazdı (`model`, `notebookReducer`, `history`, `uiReducer`, `storage`, `appReducer`). Toplam 57 test. `appReducer.test.js` Aşama 2'nin bitti tanımındaki senaryoyu (5 sayfa ekle, başlık ver, sil, yeniden aç) bellek deposuyla çalıştırıyor.
  - İlk test çalıştırmasında 5 test düştü. Hatalar: history testlerindeki sahte durum notebook biçiminde değildi; `normalizeNotebook` sayfa id'sini nesnelerden sonra alıyordu, bu yüzden aynı id'yi taşıyan nesne sayfanın id'sini kapıyordu. İkisini düzeltti.
  - DECISIONS'a 62–75 arası kararları ekledi.
- Kullanılan eklenti / komut: Claude Code (Bash, Read, Write, Edit), context7 (React `useEffectEvent` belgesi), `npm run build`, `npm run lint`, `npm test`.
- Benim kontrol ettiğim ya da değiştirdiğim: Kayıt sistemini elle test ettim. Sayfa ekleyip silerken varsayılan başlıkların tekrar ettiğini fark ettim. Kullanıcının verdiği başlıkları koruyan bir çözüm belirleyip düzelttirdim.
- Bilinen eksikler:
  - Nesne konumunun sayfa sınırına sıkıştırılması Aşama 3'te `geometry.js` ile eklenecek (karar 66).
  - Klavye kısayolları (Ctrl+Z, Ctrl+Y) Aşama 3'te eklenecek. Bu aşamada Geri al ve Yinele yalnızca butonla çalışır.
  - Araç çubuğu butonları ve panel sekmelerinin içeriği hâlâ pasif ya da yer tutucu. Aşama 3–4'te gelecek.
  - Elle test yapılmadı. Claude tarayıcıyı göremez.
- Elle test sonrası düzeltme:
  - Kullanıcı, veri varken depolama göstergesinin "%0" göstermesinin bozuk izlenimi verdiğini bildirdi. Claude göstergeyi değiştirdi: doluluk 0'dan büyük ve %1'den küçükse "%1'den az" yazar (karar 76).
  - Kullanıcının sayfa çevirme animasyonu fikri SPEC 10'a "Zaman kalırsa, Aşama 5'ten sonra" başlığıyla eklendi. Kod yazılmadı (karar 77).
  - **Kullanıcı elle testte bir hata buldu:** sayfa ekleyip sildikçe varsayılan başlıklar bozuluyordu. Aynı defterde iki "Sayfa 2" vardı, ilk sayfanın başlığı "Sayfa 8" idi. Sebep Claude'un kendi kararıydı (karar 67): numara, eklenme anındaki sayfa sayısından veriliyor ve kayda yazılıyordu. Kullanıcının tarif ettiği çözüm uygulandı (karar 78): başlıksız sayfanın `title` alanı boş metin olarak kaydedilir, ekranda sayfanın o anki sırasıyla "Sayfa N" gösterilir, eski kayıtlardaki tam "Sayfa N" başlıkları açılışta boşaltılır. Kullanıcının istediği senaryo testleri eklendi: 8 sayfa, 2. ve 5. sayfayı sil, 2 sayfa ekle; özel başlığın korunması; eski kayıt geçişi. Toplam 63 test.
  - Elle yazılmış "Sayfa N" başlığının açılışta boşaltılması bilinçli ödünleşim olarak kabul edildi (karar 79).
  - Kullanıcı düzeltmesi: bozuk kayıt, depolama doldurma ve iki sekme senaryoları elle denenmedi. Bu senaryolar yalnızca otomatik testlerle (`storage.test.js`) doğrulandı. TEST-CHECKLIST'teki işaretler kaldırıldı.
  - Çalışma biçimi hızlandırıldı (karar 80): aşama sonunda otomatik commit ve push, 5 maddelik hızlı deneme, tek partide çizim onayı.

## Aşama 3 — Editör (11 Kasım 2026)

- Yapay zekânın yaptığı:
  - Saf geometri modülünü yazdı (`lib/geometry.js`): döndürülmüş kutunun kapladığı alan, sayfa sınırına sıkıştırma, en küçük boyut, ekran-sayfa koordinat çevirisi, açı hesabı ve 15° adım, oran koruyarak ve yalnızca genişlikle boyutlandırma.
  - Nesne eylemlerini yazdı (`itemReducer.js`): ekleme (sayfa başına 3 fotoğraf sınırı dahil), silme, dönüştürme, özellik değiştirme (boş yazı silinir), geçmişe adım açmayan `item/measure`, öne getirme, arkaya gönderme. Açılışta sayfa dışındaki nesneler sayfaya geri itiliyor.
  - Editörü yazdı: `ItemFrame` (seçim çerçevesi, boyutlandırma ve döndürme tutamaçları, Pointer Events ve `setPointerCapture`, ara konumlar yerel durumda), `TextItem` ve `TextEditor` (çift tıklayınca düzenleme, Esc, yükseklik ölçümü), yer tutucu `StickerItem` ve `DecorationItem`, `PropertiesPanel`, `RotationSlider`, `TextProperties`, yer tutucu `StickerLibrary`, klavye kısayolları.
  - `geometry`, `textStyle` ve `itemReducer` testlerini yazdı. `appReducer` testlerine kabul testi 8 senaryosu (5 eylem, 5 geri al, 5 yinele) ve başka açık defterdeki değişikliğin geri alınması eklendi. Toplam 103 test.
  - Bir testin beklenen değeri yanlıştı (döndürülmüş kutunun genişliği hesaba katılmamıştı). Kod doğruydu, test düzeltildi.
  - DECISIONS'a 81–88 arası kararları ekledi.
- Kullanılan eklenti / komut: Claude Code (Bash, Read, Write, Edit), context7 (MDN Pointer Events ve `setPointerCapture`), `npm run build`, `npm run lint`, `npm test`.
- Benim kontrol ettiğim ya da değiştirdiğim: (Taslak, Claude yazdı) Aşama 3'e başlamadan önce çalışma biçimini hızlandırdım: aşama sonunda otomatik commit ve push, 5 maddelik hızlı deneme, tek partide çizim onayı (karar 80). Aşama 2'de bozuk kayıt, depolama doldurma ve iki sekme testlerini yapmadığımı düzelttim. Aşama 3'ün elle denemesi bekliyor.
- Bilinen eksikler:
  - Çıkartma ve süsler yer tutucu kutulardır; çizimler Aşama 4'te gelecek. Fotoğraf ekleme Aşama 4'te.
  - Sol sayfadaki bir nesnenin tutamacı cilt çizgisini geçerse sağ sayfanın altında kalabilir.
  - Elle test yapılmadı. Claude tarayıcıyı göremez.

## Aşama 4 — İçerik (11 Kasım 2026)

- Yapay zekânın yaptığı:
  - Fotoğraf eklemeyi yazdı: tür ve boyut kontrolü (`lib/photoRules.js`), tarayıcıda küçültme ve JPEG'e çevirme (`lib/imageCompress.js`: uzun kenar 600 px, kalite 0.75, 80 KB'ı geçerse 0.6), %90 depolama kontrolü, sayfa başına 3 fotoğraf sınırı, yükleniyor göstergesi ve SPEC 5'teki Türkçe hata mesajları.
  - Polaroid çerçeveyi (`PhotoItem`) ve Özellikler panelindeki not alanını (`CaptionField`) yazdı.
  - 7 çıkartma ve 6 süs çizimini SVG olarak tek partide üretti. Yalnızca SPEC 9.1 paleti kullanıldı (dosyalardaki renkler betikle kontrol edildi). Çizimleri başsız Edge ile bir önizleme sayfasında görüntüleyip kontrol etti; bozuk iki dosyayı ve zor seçilen iki süsü düzeltti.
  - Yer tutucuları gerçek çizimlerle değiştirdi; çıkartmalara CSS ile krem kesim kenarı ekledi.
  - `photoRules` testlerini yazdı (gif ve 20 MB reddi, 3 fotoğraf sınırı, küçültme boyutu, polaroid boyutu, doluluk artışı). Toplam 112 test. Bir testte kare fotoğrafın genişliği yanlış beklenmişti; test düzeltildi.
  - DECISIONS'a 89–95 arası kararları ekledi.
- Kullanılan eklenti / komut: Claude Code (Bash, Read, Write, Edit), Node betiği (SVG üretimi), Microsoft Edge başsız mod (önizleme ekran görüntüsü), `npm run build`, `npm run lint`, `npm test`.
- Benim kontrol ettiğim ya da değiştirdiğim: (Taslak, Claude yazdı) Aşama 3'ün hızlı denemesini yapıp "tamam" dedim. Aşama 4'ün elle denemesi ve çizim onayı bekliyor.
- Bilinen eksikler:
  - Çizimler kullanıcı onayı bekliyor.
  - Fotoğraf sıkıştırma tarayıcıya bağlı olduğu için otomatik test edilmedi; yalnızca kurallar test edildi.
  - Elle test yapılmadı. Claude tarayıcıyı göremez.

## Aşama 5 — Temizlik ve teslim (11 Kasım 2026)

- Yapay zekânın yaptığı:
  - Sadeleştirmeyi code-simplifier ajanına verdi. Ajan 11 dosyada küçük değişiklikler yaptı (karar 96). Claude değişiklikleri diff üzerinden kontrol etti; lint, 112 test ve derleme tekrar geçti.
  - `console.log`, yorum satırına alınmış kod ve kullanılmayan dışa aktarımları taradı. Konsolda yalnızca hata ayrıntısı yazan `console.error` ve `console.warn` satırları kaldı.
  - README'yi yazdı: açıklama, ekran görüntüsü, özellikler, kurulum, komutlar, teknolojiler, font lisansları, aşama aşama yapay zekâ kullanımı, bilinen sınırlar, canlı bağlantı.
  - Ekran görüntüsünü üretim derlemesinden başsız Edge ile aldı (karar 97). Görüntüde paneldeki çizim önizlemelerinin kesim kenarının fazla kalın olduğunu fark edip düzeltti (karar 98).
  - Son sürümü GitHub'a gönderdi; Netlify `main` dalından yeniden yayınlar.
- Kullanılan eklenti / komut: Claude Code (Bash, Read, Write, Edit, PowerShell), code-simplifier eklentisi, Microsoft Edge başsız mod, `vite preview`, `npm run build`, `npm run lint`, `npm test`.
- Benim kontrol ettiğim ya da değiştirdiğim: (Taslak, Claude yazdı) Aşama 4'ün hızlı denemesini yapıp çizimleri onayladım. Canlı bağlantıda hızlı denemeyi yapıp "tamam" dedim. Bu AI-LOG'un "Benim kontrol ettiğim" taslak satırlarını ve README'yi okuyup düzelteceğim.
- Bilinen eksikler:
  - Canlı bağlantıda hızlı deneme yapıldı; bozuk kayıt, depolama doldurma ve iki sekme senaryoları da bu turda denendi.
  - Sayfa çevirme animasyonu "zaman kalırsa" listesinde (karar 77).

## Ek — Sayfa çevirme animasyonu (11 Kasım 2026)

- Yapay zekânın yaptığı: Kullanıcının "kontrollü şekilde ekle" isteğiyle SPEC'teki "zaman kalırsa" maddesini uyguladı. `PageLeaf.jsx` bileşenini ve CSS animasyonunu yazdı: ileri giderken sağ, geri giderken sol yaprak cilt çevresinde döner. Veri, kayıt ve reducer'a dokunmadı. Animasyon kapalı ayarında yaprak gösterilmiyor (karar 99).
- Kullanılan eklenti / komut: Claude Code (Write, Bash), `npm run build`, `npm run lint`, `npm test`.
- Benim kontrol ettiğim ya da değiştirdiğim: (Taslak, Claude yazdı) Animasyonu istedim ve kapsamını "kontrollü" diye sınırladım. Elle denemesi bekliyor.
- Bilinen eksikler: Animasyon otomatik test edilmedi; Claude tarayıcıda animasyonu göremez.

## Ek — Nesneyi karşı sayfaya taşıma (12 Kasım 2026)

- Yapay zekânın yaptığı: İsteği önce yanlış anladı (nesnenin karşı sayfaya yalnızca görünüş olarak taşması) ve bunu yazılı olarak sundu. Kullanıcının düzeltmesiyle nesnenin karşı sayfaya geçmesini uyguladı: `geometry.js`'e `dragBoundsX` ve `dropTarget`, `itemReducer`'a sayfalar arası geçiş, `uiReducer`'a aktif sayfanın nesneyi izlemesi, `ItemFrame`'e bırakma kararı eklendi. Hedefte 3 fotoğraf varken reducer'ın koordinatı yanlış sayfaya göre yorumlayacağını fark edip düzeltti. 9 test ekledi (toplam 121). SPEC 3.1 ve karar 12'yi güncelledi, karar 100'ü yazdı.
- Kullanılan eklenti / komut: Claude Code (Bash, Read, Write, Edit), `npm run build`, `npm run lint`, `npm test`.
- Benim kontrol ettiğim ya da değiştirdiğim: (Taslak, Claude yazdı) Claude'un ilk anlayışını düzelttim: nesne karşı sayfaya taşmasın, geçsin. Bir nesnenin iki sayfanın birden elemanı sayılmaması şartını koydum. Önerilen kuralları onayladım. Sayfa çevirme animasyonunu denedim, çalışıyor.
- Bilinen eksikler: Elle deneme bekliyor. Claude tarayıcıyı göremez.
