import { expect, describe, it } from 'vitest'
import { delay } from '../src/lib/functions/delay.js'
import cache from '../src/lib/functions/cache.js'

describe('/src/lib/functions/cache.ts', () => {
  it('retrieves', async () => {
    const c = cache(0.1) // 0.25s duration
    expect(c.get()).to.equal(undefined)
    c.set('value')
    expect(c.get()).to.equal('value')
    await delay(55)
    expect(c.get()).to.equal('value')
    await delay(55)
    expect(c.get()).to.equal(undefined)
  })

  it('resets timeout', async () => {
    const c = cache(0.1) // 0.1s duration
    expect(c.get()).to.equal(undefined)
    c.set('value')
    expect(c.get()).to.equal('value')
    await delay(75)
    expect(c.get()).to.equal('value')
    c.set('value')
    await delay(75)
    expect(c.get()).to.equal('value')
  })
})
