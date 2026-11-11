// Hazır çıkartma ve süs listesi (SPEC 8). Çizimler (src) Aşama 4'te eklenir.
// size: sayfa birimiyle varsayılan boyut.
export const LIBRARY = [
  { id: 'coffee', kind: 'sticker', label: 'Kahve', size: { w: 150, h: 150 } },
  { id: 'star', kind: 'sticker', label: 'Yıldız', size: { w: 140, h: 140 } },
  { id: 'cactus', kind: 'sticker', label: 'Kaktüs', size: { w: 130, h: 160 } },
  { id: 'bow', kind: 'sticker', label: 'Fiyonk', size: { w: 160, h: 120 } },
  { id: 'deer', kind: 'sticker', label: 'Geyik', size: { w: 170, h: 170 } },
  { id: 'fairy-lights', kind: 'sticker', label: 'LED ışık', size: { w: 260, h: 110 } },
  { id: 'books', kind: 'sticker', label: 'Kitap', size: { w: 150, h: 140 } },
  { id: 'stamp', kind: 'decoration', label: 'Pul', size: { w: 130, h: 160 } },
  { id: 'washi-plain', kind: 'decoration', label: 'Washi tape', size: { w: 220, h: 60 } },
  { id: 'washi-grid', kind: 'decoration', label: 'Kareli washi tape', size: { w: 220, h: 60 } },
  { id: 'washi-dots', kind: 'decoration', label: 'Noktalı washi tape', size: { w: 220, h: 60 } },
  { id: 'clear-tape', kind: 'decoration', label: 'Bant', size: { w: 180, h: 56 } },
  { id: 'sparkle', kind: 'decoration', label: 'Işıltı', size: { w: 130, h: 130 } },
]

export const findLibraryEntry = (id) => LIBRARY.find((entry) => entry.id === id)
