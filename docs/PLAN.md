# Anı Defterim — Uygulama Planı

Aşama 0 çıktısıdır. Kaynak: `docs/SPEC.md` sürüm 4 ve `docs/DECISIONS.md` (1–49).
Plan SPEC ile çelişirse SPEC geçerlidir.

---

## 1. Durum nerede tutulur

Uygulamanın bütün durumu tek bir kök reducer'dadır: `appReducer`. Kök durum iki parçadır:

```js
AppState = {
  history: { past, present, future, lastChangedPageId },  // present = Notebook
  ui: { spreadIndex, activePageId, selectedItemId, editingItemId, panelTab, lastLibraryTab }
}
```

| Durum | Yer | Kaydedilir mi |
|---|---|---|
| Notebook (sayfalar, nesneler) | `history.present` | Evet, `ad:notebook:v1` |
| Undo geçmişi (`past`, `future`) | `history` | Hayır |
| `lastChangedPageId` | `history` | Hayır |
| `spreadIndex` | `ui` | Evet, `ad:prefs.spreadIndex` |
| `lastLibraryTab` (`stickers` / `decorations`) | `ui` | Evet, `ad:prefs.panelTab` |
| `panelTab` (`stickers` / `decorations` / `properties`) | `ui` | Hayır |
| `activePageId`, `selectedItemId`, `editingItemId` | `ui` | Hayır |
| Kayıt durumu, doluluk | `useAutosave` | Hayır |
| Başka sekme uyarısı (`stale`) | `useCrossTabGuard` | Hayır |
| Toast mesajı, onay penceresi | App `useState` | Hayır |
| Sürükleme ve kaydırıcı ara değerleri | `useItemTransform` / `RotationSlider` yerel durumu | Hayır |

**Neden tek kök reducer (karar 46):** Notebook her değiştiğinde UI referansları aynı eylemin içinde, eşzamanlı olarak düzeltilir. Efekt içinde setState gerekmez. Bu, react-hooks 7'nin kuralına uyar ve bir render boyunca bile geçersiz referans oluşmaz. `uiReducer` ve `reconcileUi` saf JS olduğu için `node --test` ile test edilir.

### 1.1 Panel sekmesi kuralları (karar 44)

| Olay | `panelTab` | `lastLibraryTab` | Seçim |
|---|---|---|---|
| Nesne seçildi | `properties` | değişmez | yeni nesne |
| Seçim kalktı | `lastLibraryTab` | değişmez | yok |
| Kullanıcı Çıkartmalar ya da Süsler sekmesine bastı | o sekme | o sekme | **durur** |
| Araç çubuğunda Çıkartma ya da Süs butonu | o sekme | o sekme | **durur** |
| Kullanıcı Özellikler sekmesine bastı (yalnızca seçim varsa etkin) | `properties` | değişmez | durur |
| Seçili nesne silindi ya da `reconcileUi` seçimi temizledi | `properties` ise `lastLibraryTab` | değişmez | yok |

---

## 2. Bileşen ağacı

```
main.jsx
└── App                         useReducer(appReducer), hook'lar, eylem dağıtımı
    ├── NarrowScreenNotice      yalnızca < 1024 px'te görünür (CSS media query)
    └── .app-shell              yalnızca ≥ 1024 px'te görünür
        ├── TopBar
        │   ├── Logo (taç + ad + slogan, TopBar içinde)
        │   ├── SaveStatus      orta
        │   └── Geri al / Yinele butonları   sağ
        ├── StaleTabNotice      başka sekme uyarısı + "Yenile" (yalnızca stale iken)
        ├── main
        │   ├── Notebook        açık defter, ölçekleme, solma animasyonu
        │   │   ├── Page (sol)
        │   │   │   ├── PageTitle            yerinde düzenleme
        │   │   │   ├── ItemFrame × n        seçim çerçevesi + tutamaçlar
        │   │   │   │   └── PhotoItem | StickerItem | DecorationItem | TextItem
        │   │   │   ├── EmptyHint            boş sayfa ipucu (Page içinde)
        │   │   │   └── sabit süsler         CSS: sayfa altı yazı, ayraç şeridi
        │   │   └── Page (sağ) ya da EmptyFace ("+ Sayfa ekle")
        │   ├── PageBar         ‹ Önceki · Sayfa 3–4 / 6 · Sonraki › · + Sayfa ekle · Sil
        │   └── Toolbar         Fotoğraf ekle · Çıkartma · Süs · Yazı ekle · Seçileni sil
        ├── SidePanel
        │   ├── sekmeler: Çıkartmalar · Süsler · Özellikler
        │   ├── StickerLibrary   kind = sticker | decoration
        │   ├── PropertiesPanel
        │   │   ├── RotationSlider
        │   │   └── TextProperties  font, boyut, kalın, italik, hizalama
        │   │       (fotoğrafta: not alanı, PropertiesPanel içinde)
        │   └── StorageMeter
        ├── Toast
        └── ConfirmDialog
```

SPEC 13'e eklenen bileşenler: `PageTitle.jsx`, `EmptyFace.jsx`, `StaleTabNotice.jsx`, `panel/RotationSlider.jsx`, `panel/TextProperties.jsx`.

---

## 3. Eylemler

`appReducer(state, action)` sırası:

1. Eylem bir notebook ya da geçmiş eylemiyse `historyReducer` çalışır.
2. Eylem bir UI eylemiyse ya da UI'ı etkileyen bir notebook eylemiyse `uiReducer` çalışır.
3. Her durumda son adımda `reconcileUi(notebook, ui, lastChangedPageId)` çalışır.

### 3.1 Notebook eylemleri (`notebookReducer.js`)

Bu eylemlerin her biri bir undo adımıdır (`item/measure` hariç). Sonucu değişmeyen eylem (aynı nesne referansı) geçmişe yazılmaz.

| type | payload | Not |
|---|---|---|
| `page/add` | `{ page }` | Sınır 8. Sayfa sona eklenir (karar 39). |
| `page/delete` | `{ pageId }` | Son sayfa silinmez. |
| `page/rename` | `{ pageId, title }` | 40 karaktere kesilir. Boşsa boş metin kalır; ekranda "Sayfa {sıra}" görünür (karar 78). |
| `item/add` | `{ pageId, item }` | Sayfa sınırına sıkıştırılır. Fotoğrafta sayfa başına 3 sınırı. |
| `item/delete` | `{ pageId, itemId }` | |
| `item/transform` | `{ pageId, itemId, x, y, w, h, rotation }` | Taşıma, boyutlandırma, döndürme ve kaydırıcı bitişi. Reducer boyutu ve konumu sınırlar. |
| `item/updateProps` | `{ pageId, itemId, props }` | Not, yazı içeriği, font, boyut, kalın, italik, hizalama. |
| `item/measure` | `{ pageId, itemId, h }` | **Geçmiş adımı açmaz** (3.2). Yalnızca yazı nesnesi. `h` aynıysa durum değişmez. Reducer nesneyi sayfaya geri iter. |
| `item/bringToFront` | `{ pageId, itemId }` | Dizinin sonuna taşır. |
| `item/sendToBack` | `{ pageId, itemId }` | Dizinin başına taşır. |

**Saflık kuralı (karar 40):** `StrictMode` reducer'ı iki kez çalıştırır. Bu yüzden id, rastgele açı ve `updatedAt` reducer içinde üretilmez. Bu değerler eylem oluşturucularda (`model.js`: `createPage`, `createItem`) üretilir ve payload ile gelir.

### 3.2 Geçmiş eylemleri (`history.js`)

| type | Etki |
|---|---|
| `history/undo` | `past` → `present`, eski `present` → `future`. `lastChangedPageId` hesaplanır. |
| `history/redo` | tersi |
| `item/measure` | `notebookReducer` uygulanır ve yalnızca `present` değişir. `past`, `future` ve `lastChangedPageId` değişmez (karar 45). |
| diğer notebook eylemleri | `notebookReducer` uygulanır. Değişiklik varsa eski `present` → `past` (en fazla 30), `future` boşalır, `lastChangedPageId` = `null`. |

`item/measure` için `future` korunur. Aksi hâlde şu senaryo Yinele geçmişini siler: kullanıcı yazı boyutunu değiştirir, Geri al'a basar, eski boyut yeniden ölçülür, ölçüm `future`'ı temizler.

`historyReducer` hangi eylemlerin birleşeceğini bir kümeden okur: `MERGE_ACTIONS = new Set(["item/measure"])`.

### 3.3 UI eylemleri (`uiReducer.js`)

| type | payload | Etki |
|---|---|---|
| `ui/setSpread` | `{ spreadIndex }` | Açık defteri değiştirir. Aktif sayfa sol sayfa olur. Seçim ve düzenleme kalkar. |
| `ui/setActivePage` | `{ pageId }` | Aktif sayfa. |
| `ui/select` | `{ itemId, pageId }` | Seçim, aktif sayfa, `panelTab = properties`. |
| `ui/deselect` | — | Seçim ve düzenleme kalkar, `panelTab = lastLibraryTab`. |
| `ui/startEdit` | `{ itemId }` | Yazı düzenleme modu. |
| `ui/endEdit` | — | Düzenleme modu kapanır. |
| `ui/setPanelTab` | `{ tab }` | Kütüphane sekmesiyse `lastLibraryTab` da güncellenir. Seçim durur. `properties` yalnızca seçim varsa kabul edilir. |

UI'ı etkileyen notebook eylemleri:
- `page/add` → yeni sayfa aktif olur, uygulama onun açık defterine geçer.
- `item/add` → yeni nesne seçilir, `panelTab = properties`. Yazı nesnesinde `editingItemId` de ayarlanır.

### 3.4 `reconcileUi` (karar 46)

Her eylemin sonunda çalışan saf fonksiyon:

1. `selectedItemId` ya da `editingItemId` var olmayan bir nesneyi gösteriyorsa temizlenir. Seçim temizlenirse ve `panelTab` `properties` ise `panelTab = lastLibraryTab`.
2. `activePageId` var olmayan bir sayfayı gösteriyorsa en yakın sayfa seçilir: silinen sayfanın eski sırası, o sıra yoksa son sayfa. Eski sıra için `reconcileUi` bir önceki notebook'u da alır.
3. `lastChangedPageId` doluysa (undo/redo) uygulama o sayfanın açık defterine geçer ve aktif sayfa o sayfa olur. Sayfa artık yoksa (örnek: sayfa eklemenin geri alınması) 2. kural uygulanır.
4. `spreadIndex` `0 … ceil(sayfaSayısı / 2) − 1` aralığına sınırlanır. Bu kural açılışta da çalışır (`createInitialState`).
5. Değişiklik yoksa aynı `ui` nesnesi döner. Böylece gereksiz render olmaz.

---

## 4. Saf mantık modülleri

| Dosya | Dışa aktarılanlar |
|---|---|
| `src/state/constants.js` | `PAGE_W = 800`, `PAGE_H = 1000`, `MAX_PAGES = 8`, `MAX_PHOTOS_PER_PAGE = 3`, `HISTORY_LIMIT = 30`, `MIN_ITEM = 40`, `STORAGE_CAPACITY = 5_000_000`, `SCHEMA_VERSION = 1`, anahtar adları |
| `src/state/model.js` | `createId`, `createPage`, `createEmptyNotebook`, `createItem`, `normalizeNotebook(raw)` → `{ notebook, warnings }` ya da `null` |
| `src/state/notebookReducer.js` | `notebookReducer` |
| `src/state/history.js` | `createHistory`, `historyReducer(reducer)`, `canUndo`, `canRedo` |
| `src/state/uiReducer.js` | `createInitialUi`, `uiReducer`, `reconcileUi` |
| `src/state/appReducer.js` | `createInitialState(notebook, prefs)`, `appReducer` |
| `src/state/storage.js` | `loadNotebook(storage)` → `{ notebook, status: "ok" \| "empty" \| "corrupt", warnings }`, `saveNotebook(storage, nb)` → `{ ok, error? }`, `loadPrefs`, `savePrefs`, `getUsage(storage)`, `wouldExceed(storage, extraChars, limit)`, `isNotebookKey(key)` |
| `src/lib/geometry.js` | `rotatedHalfExtents`, `clampItemToPage`, `clampSize`, `screenToPage`, `angleFromCenter`, `snapAngle`, `resizeKeepRatio`, `resizeWidthOnly` |
| `src/lib/photoRules.js` | `checkPhotoFile({ type, size })` → hata kodu ya da `null` |
| `src/lib/imageCompress.js` | `compressImage(file)` (tarayıcıda çalışır, test edilmez) |

`storage.js` `localStorage`'ı parametre olarak alır. Testte sahte bir nesne verilir.

### 4.1 Esnek doğrulama (`normalizeNotebook`, karar 47)

| Girdi | Sonuç |
|---|---|
| JSON hatası | bozuk |
| `pages` dizi değil ya da yok | bozuk |
| `schemaVersion` 1 değil ya da yok | bozuk |
| `pages` boş dizi | bir boş sayfa eklenir |
| 8'den fazla sayfa | silinmez, "+ Sayfa ekle" pasif kalır |
| başlık eksik, metin değil ya da tam olarak "Sayfa N" | boş metin; ekranda "Sayfa {sıra}" (karar 78) |
| `items` eksik | `[]` |
| tanınmayan nesne türü | nesne atlanır, `warnings` listesine yazılır |
| eksik ya da tekrar eden id | yeni id |
| eksik ya da sayı olmayan `x, y, w, h, rotation` | varsayılan değer, sonra sayfa sınırına sıkıştırma |
| eksik `props` alanları | türün varsayılanları (`caption: ""`, `font: "hand"`, `size: 24`, `bold: false`, `italic: false`, `align: "left"`) |
| fazladan alanlar | korunur |

`warnings` boş değilse ayrıntı konsola yazılır. Kullanıcıya uyarı gösterilmez, çünkü kayıt açıldı.

### 4.2 Birden çok sekme (`useCrossTabGuard`, karar 48)

- `window` üzerinde `storage` olayını dinler. `event.key === "ad:notebook:v1"` ise `stale = true` olur.
- `useAutosave` `paused` parametresi alır. `stale` iken bekleyen zamanlayıcı iptal edilir. `pagehide` kaydı da yazılmaz. Kayıt durumu `Kayıt durduruldu` olur.
- `StaleTabNotice` kapanmayan bir uyarı gösterir: "Defterin başka bir sekmede değişti. Kaybı önlemek için bu sekmeyi yenile." "Yenile" butonu `location.reload()` çağırır.
- Birleştirme yapılmaz.

### 4.3 Caveat ve italik (karar 49)

`italic` değeri veride kalır. `TextItem` stili: `font === "hand"` ise `font-style: normal`, değilse `italic ? "italic" : "normal"`. Bu kural `src/lib/textStyle.js` içinde saf bir fonksiyondur (`resolveTextStyle(props)`) ve test edilir.

---

## 5. Riskler ve önlemler

| # | Risk | Önlem |
|---|---|---|
| 1 | Son 600 ms'deki değişiklik sekme kapanınca kaybolur. | `useAutosave` bekleyen kaydı `pagehide` olayında hemen yazar (karar 41). |
| 2 | Fotoğraflar LocalStorage'ı doldurur, `QuotaExceededError` oluşur. | Ekleme öncesi `wouldExceed` (%90). Kayıt hatası `Kaydedilemedi` durumu olur, ekrandaki veri silinmez. Bozuk kayıt anahtarı da doluluğa dahil. |
| 3 | `StrictMode` saf olmayan reducer'da çift id ya da farklı açı üretir. | Rastgele değerler eylem oluşturucuda üretilir (3.1). |
| 4 | Döndürülmüş ve CSS ile ölçeklenmiş nesnede fare koordinatı kayar. | Bütün çeviriler `screenToPage` üzerinden yapılır. Geometri fonksiyonları birim testlidir. |
| 5 | Sürüklerken her harekette reducer çağrılırsa undo geçmişi dolar, performans düşer. | Ara değerler yerel durumda tutulur. `pointerup` anında tek eylem gider. `setPointerCapture` kullanılır. Kaydırıcıda da aynı kural geçerli. |
| 6 | Yazı yüksekliği ölçümü sonsuz render döngüsü ya da fazladan undo adımı üretir. | Ölçüm yalnızca düzenleme bitince ve özellik değişince yapılır. `h` aynıysa eylem gönderilmez. `item/measure` geçmiş adımı açmaz (karar 45). |
| 7 | Klavye kısayolları yazı yazarken nesneyi siler. | `useKeyboardShortcuts` olay hedefi `input`, `textarea` ya da `contenteditable` ise çıkar. |
| 8 | Undo, ekranda olmayan bir sayfayı değiştirir ve kullanıcı değişikliği görmez. | `lastChangedPageId` ile açık defter değişir (3.4). |
| 9 | Undo ya da silme sonrasında seçim, düzenleme ya da aktif sayfa var olmayan bir şeyi gösterir ve uygulama çöker. | `reconcileUi` her eylemde referansları temizler (3.4). Testi: `uiReducer.test.js`. |
| 10 | Geliştirme sırasında veri yapısı değişince eski kayıt bozuk sayılır ve kenara taşınır. | Esnek doğrulama (4.1). Testi: `storage.test.js`. |
| 11 | İki sekme birbirinin kaydını ezer. | `storage` olayı, kaydı durdurma ve "Yenile" uyarısı (4.2). README'de bilinen sınır. |
| 12 | ESLint'in react-hooks 7 kuralları (efekt içinde setState, render sırasında ref okuma) uyarı verir. | UI temizliği reducer'da yapılır. Ölçüm ve ara durum desenleri baştan bu kurallara göre yazılır. `npm run lint` her aşamada sıfır uyarıyla biter. |
| 13 | 1024 × 768 ekranda defter, sayfa çubuğu ve araç çubuğu dikeyde sığmaz. | Defter hem genişliğe hem yüksekliğe göre ölçeklenir (`min()` ile). Aşama 1'de 1024 × 768 elle test edilir. |
| 14 | TTF dosyaları büyüktür ve ilk açılış yavaşlar. | `font-display: swap`. Yalnızca 3 aile. Courier Prime için 4 dosya, diğerleri değişken font. |
| 15 | Netlify yayını kullanıcıya bağlı. | `netlify.toml` hazır olur. Adımlar TEST-CHECKLIST'te yazılı olur (karar 38). |
| 16 | `npm test` hiç test dosyası yokken hata verebilir. | Aşama 1'de `constants.test.js` eklenir. |

---

## 6. Aşama başına dosya listesi

Her aşamanın sonunda şu dosyalar da güncellenir: `docs/DECISIONS.md`, `docs/TEST-CHECKLIST.md`, `docs/AI-LOG.md`.

### Aşama 1 — Kurulum ve görsel iskelet

Silinecek demo dosyaları: `src/App.css`, `src/index.css`, `src/assets/hero.png`, `src/assets/react.svg`, `src/assets/vite.svg`, `public/icons.svg`.

| Dosya | İş |
|---|---|
| `package.json` | ad `ani-defterim`, `"test": "node --test tests/"` |
| `eslint.config.js` | `tests/**` için Node global'leri |
| `netlify.toml` | build `npm run build`, publish `dist` |
| `index.html` | `lang="tr"`, başlık "Anı Defterim" |
| `public/favicon.svg` | taç ikonu |
| `src/main.jsx` | stil içe aktarımları |
| `src/App.jsx` | iskelet yerleşim, statik veri |
| `src/state/constants.js` | sabitler |
| `src/styles/tokens.css`, `base.css`, `fonts.css`, `atmosphere.css` | renkler, LED arka plan, `@font-face` |
| `src/styles/*.css` | bileşen başına bir dosya |
| `src/components/TopBar.jsx`, `SaveStatus.jsx` | statik "Kaydedildi" |
| `src/components/Notebook.jsx`, `Page.jsx`, `PageTitle.jsx`, `EmptyFace.jsx`, `PageBar.jsx` | görsel, butonlar pasif |
| `src/components/Toolbar.jsx` | butonlar pasif |
| `src/components/panel/SidePanel.jsx`, `StorageMeter.jsx` | sekmeler, gösterge (%0) |
| `src/components/NarrowScreenNotice.jsx` | bilgi kartı |
| `src/assets/fonts/` | Caveat, Lora, Lora italik, Courier Prime × 4 (TTF) + `OFL.txt` dosyaları |
| `tests/constants.test.js` | `npm test` için ilk test |

### Aşama 2 — Veri ve kayıt

| Dosya | İş |
|---|---|
| `src/state/model.js` | oluşturucular, `normalizeNotebook` |
| `src/state/notebookReducer.js` | sayfa eylemleri |
| `src/state/history.js` | undo/redo, `MERGE_ACTIONS` |
| `src/state/uiReducer.js`, `src/state/appReducer.js` | UI durumu, `reconcileUi`, kök reducer |
| `src/state/storage.js` | okuma, yazma, doluluk, bozuk kayıt |
| `src/hooks/useAutosave.js` | 600 ms debounce, `pagehide`, `paused`, durum, doluluk |
| `src/hooks/useCrossTabGuard.js` | `storage` olayı |
| `src/hooks/usePrefs.js` | `spreadIndex` ve `lastLibraryTab` yazma |
| `src/components/ConfirmDialog.jsx`, `Toast.jsx`, `StaleTabNotice.jsx` | onay, hata mesajı, başka sekme uyarısı |
| `App.jsx`, `TopBar.jsx`, `SaveStatus.jsx`, `Page.jsx`, `PageTitle.jsx`, `PageBar.jsx`, `EmptyFace.jsx`, `SidePanel.jsx`, `StorageMeter.jsx` | işlevler bağlanır |
| `tests/model.test.js` | `normalizeNotebook` tablosu (4.1) |
| `tests/notebookReducer.test.js` | sayfa eylemleri |
| `tests/history.test.js` | 30 adım sınırı, undo/redo, `item/measure`'ın `past` ve `future`'ı değiştirmemesi |
| `tests/uiReducer.test.js` | panel sekmesi kuralları (1.1), `reconcileUi` (3.4), `spreadIndex` sınırı |
| `tests/storage.test.js` | kayıt/okuma, quota hatası, bozuk kayıt tek anahtara üzerine yazılır, **eski biçimli kayıt bozuk sayılmaz ve yerinde kalır** |

`item/measure` Aşama 3'te eklenir, ama `history.js` birleştirme kuralı ve testi Aşama 2'de yazılır.

### Aşama 3 — Editör

| Dosya | İş |
|---|---|
| `src/lib/geometry.js` | dönüşüm ve sınır hesabı |
| `src/lib/textStyle.js` | `resolveTextStyle` (Caveat'ta italik uygulanmaz) |
| `src/state/notebookReducer.js` | nesne eylemleri, `item/measure` |
| `src/hooks/useItemTransform.js`, `useKeyboardShortcuts.js` | etkileşim |
| `src/components/items/ItemFrame.jsx`, `TextItem.jsx`, `StickerItem.jsx`, `DecorationItem.jsx` | yer tutucu şekiller |
| `src/components/panel/PropertiesPanel.jsx`, `RotationSlider.jsx`, `TextProperties.jsx`, `StickerLibrary.jsx` (yer tutucu liste) | panel |
| `Page.jsx`, `Toolbar.jsx`, `SidePanel.jsx`, `App.jsx` | bağlantılar |
| `tests/geometry.test.js`, `tests/textStyle.test.js`, `tests/notebookReducer.test.js` (eklemeler) | testler |

### Aşama 4 — İçerik

| Dosya | İş |
|---|---|
| `src/lib/photoRules.js`, `src/lib/imageCompress.js` | fotoğraf kontrolü ve küçültme |
| `src/components/items/PhotoItem.jsx` | polaroid ve not |
| `src/data/stickers.js` | 13 çizimin kaydı |
| `src/assets/stickers/*.svg` | 3 parti, her partiden sonra onay (SPEC 8.3) |
| `StickerItem.jsx`, `DecorationItem.jsx`, `StickerLibrary.jsx`, `Toolbar.jsx`, `PropertiesPanel.jsx` | gerçek içerik |
| `tests/photoRules.test.js` | testler |

### Aşama 5 — Temizlik ve teslim

| Dosya | İş |
|---|---|
| bütün `src/` | code-simplifier, kullanılmayan kod ve konsol temizliği |
| `README.md` | SPEC 10 Aşama 5 listesi, font lisansları, bilinen sınırlar (SPEC 12, iki sekme maddesi dahil) |
| `docs/screenshots/` | en az 1 ekran görüntüsü (kullanıcı alır, Claude tarayıcıyı göremez) |
