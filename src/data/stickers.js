import coffee from '../assets/stickers/coffee.svg'
import star from '../assets/stickers/star.svg'
import cactus from '../assets/stickers/cactus.svg'
import bow from '../assets/stickers/bow.svg'
import deer from '../assets/stickers/deer.svg'
import fairyLights from '../assets/stickers/fairy-lights.svg'
import books from '../assets/stickers/books.svg'
import stamp from '../assets/stickers/stamp.svg'
import washiPlain from '../assets/stickers/washi-plain.svg'
import washiGrid from '../assets/stickers/washi-grid.svg'
import washiDots from '../assets/stickers/washi-dots.svg'
import clearTape from '../assets/stickers/clear-tape.svg'
import sparkle from '../assets/stickers/sparkle.svg'

// Hazır çıkartma ve süs listesi (SPEC 8). size: sayfa birimiyle varsayılan boyut;
// oranı çizimin viewBox oranıyla aynıdır.
export const LIBRARY = [
  { id: 'coffee', kind: 'sticker', label: 'Kahve', src: coffee, size: { w: 150, h: 150 } },
  { id: 'star', kind: 'sticker', label: 'Yıldız', src: star, size: { w: 140, h: 140 } },
  { id: 'cactus', kind: 'sticker', label: 'Kaktüs', src: cactus, size: { w: 128, h: 160 } },
  { id: 'bow', kind: 'sticker', label: 'Fiyonk', src: bow, size: { w: 160, h: 120 } },
  { id: 'deer', kind: 'sticker', label: 'Geyik', src: deer, size: { w: 170, h: 170 } },
  { id: 'fairy-lights', kind: 'sticker', label: 'LED ışık', src: fairyLights, size: { w: 260, h: 110 } },
  { id: 'books', kind: 'sticker', label: 'Kitap', src: books, size: { w: 150, h: 135 } },
  { id: 'stamp', kind: 'decoration', label: 'Pul', src: stamp, size: { w: 130, h: 160 } },
  { id: 'washi-plain', kind: 'decoration', label: 'Washi tape', src: washiPlain, size: { w: 220, h: 60 } },
  { id: 'washi-grid', kind: 'decoration', label: 'Kareli washi tape', src: washiGrid, size: { w: 220, h: 60 } },
  { id: 'washi-dots', kind: 'decoration', label: 'Noktalı washi tape', src: washiDots, size: { w: 220, h: 60 } },
  { id: 'clear-tape', kind: 'decoration', label: 'Bant', src: clearTape, size: { w: 180, h: 56 } },
  { id: 'sparkle', kind: 'decoration', label: 'Işıltı', src: sparkle, size: { w: 130, h: 130 } },
]

export const findLibraryEntry = (id) => LIBRARY.find((entry) => entry.id === id)
