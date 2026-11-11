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
