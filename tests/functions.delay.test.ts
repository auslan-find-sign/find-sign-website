import { expect, describe, it } from 'vitest'
import { delay, lagSwitch } from '../src/lib/functions/delay.js'

describe('/src/lib/functions/delay.ts delay()', () => {
  it('seems accurate', async () => {
    const start = Date.now()
    await delay(20)
    const end = Date.now()

    expect(end - start).to.be.above(18)
    expect(end - start).to.be.below(22)
  })
})
