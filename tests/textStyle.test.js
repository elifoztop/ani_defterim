import { test } from 'node:test'
import assert from 'node:assert/strict'
import { canItalic, clampTextSize, resolveTextStyle } from '../src/lib/textStyle.js'

const props = (extra = {}) => ({ content: 'a', font: 'serif', size: 24, bold: false, italic: false, align: 'left', ...extra })

test('El yazısında italik uygulanmaz ama değer veride kalır', () => {
  const p = props({ font: 'hand', italic: true })
  assert.equal(resolveTextStyle(p).fontStyle, 'normal')
  assert.equal(p.italic, true)
  assert.equal(canItalic('hand'), false)
})

test('başka fonta geçince italik yeniden uygulanır', () => {
  assert.equal(resolveTextStyle(props({ font: 'serif', italic: true })).fontStyle, 'italic')
  assert.equal(resolveTextStyle(props({ font: 'typewriter', italic: true })).fontStyle, 'italic')
})

test('El yazısında yapay eğiklik kapalıdır', () => {
  assert.equal(resolveTextStyle(props({ font: 'hand' })).fontSynthesisStyle, 'none')
})

test('font, kalınlık ve hizalama çevrilir', () => {
  const style = resolveTextStyle(props({ font: 'typewriter', bold: true, align: 'center', size: 40 }))
  assert.equal(style.fontFamily, 'var(--font-type)')
  assert.equal(style.fontWeight, 700)
  assert.equal(style.textAlign, 'center')
  assert.equal(style.fontSize, 40)
})

test('bilinmeyen font El yazısı olur', () => {
  assert.equal(resolveTextStyle(props({ font: 'comic' })).fontFamily, 'var(--font-hand)')
})

test('clampTextSize 14–72 aralığına sınırlar', () => {
  assert.equal(clampTextSize(10), 14)
  assert.equal(clampTextSize(100), 72)
  assert.equal(clampTextSize('30.4'), 30)
  assert.equal(clampTextSize('abc'), null)
})
