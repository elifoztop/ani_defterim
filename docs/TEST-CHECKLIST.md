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
