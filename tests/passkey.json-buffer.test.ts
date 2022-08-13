import { expect, describe, it } from 'vitest'
import { stringify, parse } from '../src/lib/passkey/json-buffer'
import { randomBytes } from 'tweetnacl-ts'

const testObject = {
  foo: true,
  bar: false,
  baz: null,
  one: 1,
  twopoint2: 2.2,
  arr: [1, 2, true, false, 'foo', 'bar', ['a', 'b']],
  obj: { a: 1, b: true },
  buff: new Uint8Array([1,2,3,4,5,6,7,8,9])
}

describe('/src/lib/passkey/json-buffer.ts', () => {
  it('stringify', async () => {
    const onetwothree = new Uint8Array([1,2,3])
    expect(stringify(onetwothree)).to.equal('"bytes:1,2,3"')
    expect(stringify({ buff: onetwothree })).to.equal('{"buff":"bytes:1,2,3"}')
    expect(stringify([onetwothree])).to.equal('["bytes:1,2,3"]')
  })

  it('parse', async () => {
    const onetwothree = '"bytes:1,2,3"'
    expect(parse(onetwothree)).to.be.instanceOf(Uint8Array)
    expect(parse(onetwothree)).to.have.length(3)
    expect([...parse(onetwothree) as Uint8Array]).to.deep.equal([1,2,3])
  })

  it('roundtrips', async () => {
    const sixteenK = randomBytes(1024*16)
    expect([...parse(stringify(sixteenK)) as Uint8Array]).to.deep.equal([...sixteenK])
    expect(parse(stringify(testObject))).to.deep.equal(testObject)
  })
})
