# Anı Defterim: Claude Code çalışma kuralları

Bu dosya her oturumda geçerlidir. Ürünün tanımı `docs/SPEC.md` dosyasındadır. Planlama kararları ve gerekçeleri `docs/DECISIONS.md` dosyasındadır. Bir kural ile SPEC çelişirse çalışmayı durdur ve bana sor.

## Proje

Anı Defterim, bilgisayar tarayıcısında çalışan bir dijital scrapbook defteridir. Bir eğitim programının bitirme projesidir. Proje "Web Geliştirme; Yapay Zeka Proje Yönergesi" kurallarına uymak zorundadır. Teslim süresi 1-2 haftadır. Kapsamı SPEC'in dışına genişletme.

## Mevcut kurulum

- Proje resmi `create-vite` React şablonuyla kuruldu (JavaScript/JSX, TypeScript yok). Kurulumu tekrar yapma.
- React 19, Vite 8, `@vitejs/plugin-react` (Oxc tabanlı). React Compiler etkin değil.
- Bütün dosyalar ES modülüdür (`"type": "module"`).
- Giriş zinciri: `index.html` → `src/main.jsx` (`<App />` bileşenini `StrictMode` içinde `#root` öğesine bağlar) → `src/App.jsx`.
- `src/App.jsx` hâlâ şablonun demo sayfasını içerir. Aşama 1 bu sayfayı kaldırır.
- Koddan içe aktarılan dosyalar `src/assets/` altındadır (Vite bunlara parmak izi ekler). Olduğu gibi sunulan dosyalar `public/` altındadır.

## Komutlar

- `npm run dev` — geliştirme sunucusu
- `npm run build` — `dist/` klasörüne üretim derlemesi
- `npm run preview` — `dist/` klasörünü yerelde sunar
- `npm run lint` — bütün projede ESLint
- `npm test` — `node --test tests/` (Aşama 1 bu betiği `package.json` dosyasına ekler)

## Teknoloji

- Stil için saf CSS ve CSS değişkenleri kullan.
- Çalışma zamanı bağımlılığı olarak yalnızca `react` ve `react-dom` var. Vite şablonunun kurduğu geliştirme bağımlılıklarına (vite, eslint, @vitejs/plugin-react ve eslint eklentileri) dokunma.
- Başka bir paket gerekli görünürse paketi kurma. Önce gerekçeyi bana yaz ve onayımı bekle.
- Test için Vitest, Jest ya da başka bir test paketi kurma. Testleri Node'un yerleşik `node:test` ve `node:assert` modülleriyle yaz.
- Şunları kullanma: TypeScript, Tailwind, Bootstrap, Redux, react-moveable, react-rnd, UI kütüphaneleri.
- Veriyi yalnızca LocalStorage'da sakla. Sunucu, backend ve veritabanı yazma.
- Fontları ve çıkartma SVG dosyalarını `src/assets/` altında yerel dosya olarak tut. CDN ya da dış servis kullanma.
- Netlify `dist/` klasörünü yayına alır.

## Çalışma biçimi

1. Bir oturumda yalnızca bir aşamayı uygula. Aşamalar SPEC bölüm 10'dadır.
2. Bir aşamanın içinde küçük teknik kararları kendin ver. Her kararı `docs/DECISIONS.md` dosyasının sonuna tek satırla ekle.
3. Bir aşamayı bitirince dur. Bir sonraki aşamaya kendin başlama.
4. Aşama sonunda şu üç işi yap:
   - `npm run build`, `npm run lint` ve `npm test` komutlarını çalıştır. Üçü de hatasız bitmeli.
   - `docs/TEST-CHECKLIST.md` dosyasına o aşamanın elle test adımlarını yaz.
   - `docs/AI-LOG.md` dosyasına aşamanın kaydını ekle.
5. Ben elle test edip "devam" demeden commit önerme.
6. TEST-CHECKLIST'te yalnızca benim açıkça bildirdiğim maddeleri işaretle. Bildirmediğim maddeyi işaretsiz bırak ve bana sor.

Tarayıcıyı göremezsin. Bir özelliği "çalışıyor" diye raporlama. "Derleme, lint ve testler geçti, elle test bekliyor" diye raporla.

## Kod kuralları

- Mantık kodunu (`src/state/`, `src/lib/geometry.js`) saf JavaScript olarak yaz. Bu dosyalar JSX, CSS, DOM ya da `window` içermez. Böylece `node --test` bu dosyaları tarayıcı olmadan test eder.
- Bir bileşen dosyası (`.jsx`) yalnızca bileşen dışa aktarır. Sabitleri, yardımcı fonksiyonları ve hook dışı mantığı ayrı `.js` dosyalarına koy. Aksi hâlde ESLint'in react-refresh kuralı uyarı verir ve Fast Refresh bozulur.
- Not defteri verisini yalnızca reducer değiştirir. Bileşenler veriyi doğrudan değiştirmez.
- Sürükleme sırasında ara konumları bileşenin yerel durumunda tut. Reducer'a yalnızca `pointerup` anında tek bir eylem gönder.
- Bir bileşen 150 satırı geçerse böl. Bir fonksiyon 40 satırı geçerse böl.
- Kod adlarını İngilizce yaz. Kullanıcının gördüğü bütün metinleri Türkçe yaz.
- Her hata durumunda kullanıcıya Türkçe ve anlaşılır bir mesaj göster. Konsola yalnızca ayrıntıyı yaz.
- Yalnızca istenen değişikliği yap. İlgisiz dosyaları yeniden düzenleme.
- Commit öncesi kullanılmayan kodu, `console.log` satırlarını ve yorum satırına alınmış kodu sil.

## Kontrol

- React 19, Vite 8 ve Pointer Events için güncel dokümanı context7 ile kontrol et.
- Ay ya da hilal motifi kullanma.
- Referans tasarım `docs/referans.png` dosyasındadır. Görseldeki fotoğrafları ve çizimleri kopyalama. Yalnızca yerleşim fikrini kullan.

## AI-LOG biçimi

```
## Aşama N — kısa ad (tarih)
- Yapay zekânın yaptığı: ...
- Kullanılan eklenti / komut: ...
- Benim kontrol ettiğim ya da değiştirdiğim: (bunu ben doldururum)
- Bilinen eksikler: ...
```
