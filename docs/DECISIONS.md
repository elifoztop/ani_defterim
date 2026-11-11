# Kararlar

Bu dosya projenin bütün kararlarını ve gerekçelerini tutar. 1–18 arası kararlar planlama oturumunda alındı. Claude Code geliştirme sırasında aldığı küçük kararları tablonun sonuna ekler.

| # | Karar | Gerekçe |
|---|---|---|
| 1 | Süre 1-2 hafta. Yalnızca çekirdek özellikler yapılır. | Teslim süresi kısa. Yönerge kusursuz ürün değil, çalışan ve yayında olan bir proje bekliyor. |
| 2 | Projenin kalbi kalıcı kayıttır. Kayıt editörden önce yazılır. | Kullanıcının tek bir özellik seçme sorusuna verdiği cevap. |
| 3 | Kalıcılık aynı tarayıcıdadır. Bulut ve hesap yok. | Kullanıcının senaryosu "sayfayı kapatıp açınca her şey yerinde". Yönerge backend istemiyor. |
| 4 | Sticker Studio çıkarıldı. | Süre kısa. Öncelik kayıt. |
| 5 | Fotoğraflar 600 px'e küçültülür, sayfa başına en fazla 3. Kayıt LocalStorage'da. | LocalStorage yaklaşık 5 MB. Yönerge LocalStorage'ı öneriyor. IndexedDB'ye göre daha basit ve daha az hata riski. |
| 6 | Sayfa yönetimi sade: ekle, sil, başlık, önceki/sonraki. En fazla 8 sayfa. | Kullanım senaryosu "birkaç temalı sayfa". |
| 7 | Sayfalar yalnızca başlıkla ayrılır. Tema ve arka plan yok. | Kullanıcının tercihi. Veri modeli sadeleşir. |
| 8 | Taşıma, boyutlandırma, döndürme ve Undo/Redo var. Çoklu seçim ve ayrıntılı katman yönetimi yok. | Dördü aynı dönüşüm verisini kullanır. Undo, reducer yapısıyla doğal gelir. |
| 9 | Defterin her yüzü ayrı bir sayfadır. Son tıklanan sayfa aktif sayfadır. | Kullanıcının tercihi. |
| 10 | PNG dışa aktarma yok. | Kullanıcının tercihi. Projenin en büyük teknik yükü kalktı. |
| 11 | Yalnızca bilgisayar (en az 1024 px). Dar ekranda bilgi kartı. | Kullanıcının tercihi. Bilgi kartı, eğitmen linki telefondan açarsa ilk izlenimi korur. |
| 12 | Nesneler kendi sayfasında kalır, sayfa sınırını geçmez. | Kullanıcının tercihi. Koordinatlar sayfaya göre tutulur. |
| 13 | React + Vite, saf CSS, `useReducer`. Ek bağımlılık yok. | Yönerge adım 1 ve 3. Proje Çıktıları: "React vb. kütüphane ve çatıların temellerini uygular". |
| 14 | Dört nesne türü: fotoğraf, çıkartma, süs, yazı. | Kullanıcının tercihi. Dördü aynı nesne yapısını paylaşır. |
| 15 | Çıkartmaları Claude SVG olarak çizer: 12 çıkartma, 6 süs, 3 partide onaylı. | Kullanıcının tercihi. Lisans sorunu yok. Tutarlı görsel dil. |
| 16 | Yazı ayarları: 3 font, boyut, kalın, italik, hizalama. Tek mürekkep rengi. Polaroid notu var. | Kullanıcının tercihi. Renk ayarı yok, vintage kağıtta tutarlı görünüm. |
| 17 | Uygulama boş defterle açılır. Boş sayfada ipucu görünür. | Kullanıcının tercihi. README ekran görüntüsü dolu bir sayfayla alınmalı. |
| 18 | Atmosfer: LED ışıkları, cam paneller, defter. Masa süsü yok. | Kullanıcının tercihi. Görsel yük ve geliştirme süresi dengede. |
| 19 | Arayüz dili Türkçe. | Kullanıcının tercihi. |
| 20 | Proje adı "Anı Defterim", slogan "Burası benim krallığım". Logo ikonu küçük bir taç. Klasör ve paket adı `ani-defterim`. LocalStorage öneki `ad:`. | Kullanıcının tercihi. Türkçe arayüzle uyumlu. Paket adında Türkçe karakter kullanılamaz. |
| 21 | Karar 15 güncellendi. Çıkartmalar (7): kahve, yıldız, kaktüs, fiyonk, geyik, LED ışık, kitap. Süsler (4 tür, 6 çizim): pul, 3 desenli washi tape, yarı saydam bant, ışıltı. Panelde grup başlığı yok. | Kullanıcı içeriği kendisi seçti. Polaroid süsü çıkarıldı, çünkü fotoğraflar zaten polaroid. Bant ile washi tape görünüşte ayrışsın diye bant yarı saydam selobant oldu. |
| 22 | Çizim paletine üç eskitilmiş kahverengi ton eklendi (`--vintage-umber`, `--vintage-sepia`, `--vintage-tan`). Bu tonlar yalnızca çizimlerde kullanılır. Çıkartmalarda krem kesim kenarı var. | Kahve, geyik, kitap ve saksı kahverengi ister. Vintage estetiği proje paletinden kopmadan sağlanır. |
