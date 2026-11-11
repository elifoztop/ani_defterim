import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  angleFromCenter,
  clampItemToPage,
  clampSize,
  normalizeAngle,
  resizeKeepRatio,
  resizeWidthOnly,
  rotatedHalfExtents,
  screenToPage,
  snapAngle,
} from '../src/lib/geometry.js'

const near = (actual, expected, eps = 1e-6) =>
  assert.ok(Math.abs(actual - expected) < eps, `${actual} ≈ ${expected}`)
const box = (extra = {}) => ({ type: 'sticker', x: 400, y: 500, w: 100, h: 50, rotation: 0, ...extra })

test('normalizeAngle açıyı -180..180 aralığına getirir', () => {
  assert.equal(normalizeAngle(190), -170)
  assert.equal(normalizeAngle(-190), 170)
  assert.equal(normalizeAngle(540), 180)
  assert.equal(normalizeAngle(-180), 180)
  assert.equal(normalizeAngle(45), 45)
})

test('snapAngle 15° adıma yuvarlar', () => {
  assert.equal(snapAngle(7), 0)
  assert.equal(snapAngle(8), 15)
  assert.equal(snapAngle(-52), -45)
})

test('rotatedHalfExtents: 0°, 90° ve 45°', () => {
  assert.deepEqual(rotatedHalfExtents(100, 50, 0), { hx: 50, hy: 25 })
  const r90 = rotatedHalfExtents(100, 50, 90)
  near(r90.hx, 25)
  near(r90.hy, 50)
  const r45 = rotatedHalfExtents(100, 100, 45)
  near(r45.hx, 50 * Math.SQRT2)
})

test('clampSize en küçük 40 birimi ve sayfa boyutunu uygular', () => {
  assert.deepEqual(clampSize({ w: 10, h: 10, rotation: 0 }), { w: 40, h: 40 })
  assert.deepEqual(clampSize({ w: 2000, h: 50, rotation: 0 }), { w: 800, h: 50 })
})

test('clampSize döndürülmüş büyük kutuyu oranı koruyarak sığdırır', () => {
  const { w, h } = clampSize({ w: 800, h: 800, rotation: 45 })
  const { hx, hy } = rotatedHalfExtents(w, h, 45)
  assert.ok(hx * 2 <= 800 + 1e-9 && hy * 2 <= 1000 + 1e-9)
  near(w, h)
})

test('clampItemToPage kenara sürüklenen nesneyi kenarda durdurur', () => {
  const item = clampItemToPage(box({ x: -50, y: 2000 }))
  assert.equal(item.x, 50)
  assert.equal(item.y, 975)
})

test('clampItemToPage döndürülmüş kutunun kapladığı alanı kullanır', () => {
  const item = clampItemToPage(box({ x: 0, rotation: 90 }))
  near(item.x, 25)
})

test('clampItemToPage yazı nesnesinde yüksekliği değiştirmez', () => {
  const item = clampItemToPage(box({ type: 'text', w: 10, h: 30 }))
  assert.equal(item.w, 40)
  assert.equal(item.h, 30)
})

test('clampItemToPage sınır içindeki nesneyi değiştirmez', () => {
  const item = box()
  assert.deepEqual(clampItemToPage(item), item)
})

test('screenToPage ölçeklenmiş sayfada koordinatı çevirir', () => {
  const rect = { left: 100, top: 50, width: 400, height: 500 }
  assert.deepEqual(screenToPage(300, 300, rect), { x: 400, y: 500 })
  assert.deepEqual(screenToPage(100, 50, rect), { x: 0, y: 0 })
})

test('angleFromCenter: yukarı 0°, sağ 90°, sol -90°', () => {
  near(angleFromCenter(0, 0, 0, -10), 0)
  near(angleFromCenter(0, 0, 10, 0), 90)
  near(angleFromCenter(0, 0, -10, 0), -90)
  near(Math.abs(angleFromCenter(0, 0, 0, 10)), 180)
})

test('resizeKeepRatio oranı korur ve sol üst köşeyi sabit tutar', () => {
  const item = box({ x: 100, y: 100, w: 100, h: 50 })
  const next = resizeKeepRatio(item, { x: 250, y: 175 })
  near(next.w / next.h, 2)
  near(next.w, 200)
  near(next.x - next.w / 2, 50)
  near(next.y - next.h / 2, 75)
})

test('resizeKeepRatio döndürülmüş nesnede de oranı korur', () => {
  const item = box({ rotation: 30 })
  const next = resizeKeepRatio(item, { x: 520, y: 600 })
  near(next.w / next.h, 2)
})

test('resizeKeepRatio en küçük boyutun altına inmez', () => {
  const next = resizeKeepRatio(box(), { x: 300, y: 400 })
  near(Math.min(next.w, next.h), 40)
})

test('resizeWidthOnly yalnızca genişliği değiştirir', () => {
  const item = box({ type: 'text', x: 100, y: 100, w: 100, h: 50 })
  const next = resizeWidthOnly(item, { x: 300, y: 500 })
  near(next.w, 250)
  assert.equal(next.h, 50)
  near(next.x - next.w / 2, 50)
})
