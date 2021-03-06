import { expect, describe, it } from 'vitest'
import { encodeFilename, decodeFilename, fn } from '../src/lib/models/filename-codec.js'

const samples = [
  'Hello world.',
  'i-am-a-nice-url',
  '๐ซฅ emoji',
  'ฤัฃ๐ ีฎแปลฟฤฃศแฅ๐วฉฤพแธฟ๊ศฏ๐ฑ๐๐๐ดศถ๐๐ฯ๐๐๐ฃ1234567890!@#$%^&*()-_=+[{]};:\'",<.>/?~๐แธ๐ข๐ฏูคแธิะว๐ฦิธโฒ๐เงฆฮก๐คษ๐ขศะฆ๐ฑั ๐งฦณศคังแฏฤ๐ฑแป๐๐แน๐ฒ๐๐ฤผแนละพ๐๐แตฒ๊ฑ๐ฉแปซ๐ลต๐๐ลบ1234567890!@#$%^&*()-_=+[{]};:\'",<.>/?~ะแธโฒค๐๐ค๐๊ ๊งศ๐๐ฅ๊ก๐๐ตวฌ๐ฟ๐ล๐๐ฏ๐ด๐๐๊ซลธ๐กแบฃ๐ขฦ๐ผแธแบฟแตฎโ๐แฅ๐ะบฮนแนีคโฑบ๐๐ฒ๐ฃ๐ลง๐ขแนฝแบ๐แงลพ1234567890!@#$%^&*()-_=+[{]};:\'",<.>/?~ัฆ๐ฑฦแฮฃโฑิาคูก๐ะ๐๐ฦศ๐ธ๐แน๐ขแนฎแนบฦฒแ๊ซ๐๐ญ๐ถแรงแซ๐๐ฟ๐แธง๐๐ฃาษญแธฟ๐๐จ๐๐ขแน๐ผัรบ๐ณแบโคฌ๐ฒ๐1234567890!@#$%^&*()-_=+[{]};:\'",<.>/?~๐ ฮ๐๐๐ด๐ฤขศแป๐ต๊ส๐ผโเงฆ๐ธ๐คี๊ขแนฐวโค๐โฒฌ๐๐๐ข๐ค'
]

describe('/src/lib/models/filename-codec', () => {
  it('roundtrip', () => {
    for (const sample of samples) {
      const encoded = encodeFilename(sample)
      expect(encoded).does.not.match(/[^a-z0-9*'()~_.!-]/gmiu)
      const decoded = decodeFilename(sample)
      expect(decoded).to.equal(sample)
    }
  })

  it('fn template works', () => {
    expect(fn`foo/${'bar'}/baz`).to.equal('foo/bar/baz')
    expect(fn`${'๐ฅฐ'}`).to.equal(encodeFilename('๐ฅฐ'))
    expect(fn`/i/like/$@BEANS`).to.equal('/i/like/$@BEANS')
    expect(fn`/i/dislike/${'*&^~'}`).to.not.equal('/i/dislike/*&^~')
  })

  it('doesn\'t confuse itself', () => {
    for (const sample of ['๐คช', '๐ฑ๐๐๐ดศถ๐๐ฯ๐๐๐ฃ12345678', 'hello my friend']) {
      expect(decodeFilename(encodeFilename(encodeFilename(sample)))).to.equal(encodeFilename(sample))
      expect(decodeFilename(encodeFilename(encodeFilename(sample)))).to.not.equal(sample)
      expect(decodeFilename(encodeFilename(encodeFilename(sample)))).to.not.equal(encodeFilename(encodeFilename(sample)))
    }
  })
})
