// Kullanıcıya gösterilen hata ve uyarı metinleri.
export const MESSAGES = {
  corrupt: 'Kayıtlı defter okunamadı. Defter boş açıldı. Eski kayıt tarayıcıda ayrı bir anahtara yedeklendi.',
  unavailable: 'Tarayıcı bu sayfanın veri kaydetmesine izin vermiyor. Değişiklikler kaydedilmeyecek.',
  saveQuota: 'Değişiklik kaydedilemedi, depolama alanı dolu. Bir fotoğrafı silip tekrar dene.',
  saveUnknown: 'Değişiklik kaydedilemedi. Biraz sonra tekrar dene.',
  storageWarn: 'Depolama alanı dolmak üzere.',
  staleTab: 'Defterin başka bir sekmede değişti. Kaybı önlemek için bu sekmeyi yenile.',
  maxPages: 'En fazla 8 sayfa olabilir.',
  photoType: 'Bu dosya türü desteklenmiyor. PNG, JPG ya da WEBP seç.',
  photoSize: "Bu fotoğraf 15 MB'tan büyük. Daha küçük bir dosya seç.",
  photoRead: 'Fotoğraf açılamadı. Başka bir dosya dene.',
  photoStorage: 'Depolama alanı dolmak üzere. Yeni fotoğraf eklemek için önce bir fotoğrafı sil.',
  photoLimit: 'Bu sayfada en fazla 3 fotoğraf olabilir.',
  lastPage: 'Defterde en az bir sayfa olmalı.',
}

export const deletePageQuestion = (title) =>
  `“${title}” sayfası ve üzerindeki her şey silinecek. Emin misin?`
