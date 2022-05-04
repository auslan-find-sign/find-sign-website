import { expect, describe, it } from 'vitest'
import { count, times } from '../src/lib/functions/iters.js'

describe('/src/lib/functions/iters.ts', () => {
  it('count() seems accurate', () => {
    expect([...count(0)]).to.deep.equal([])
    expect([...count(1)]).to.deep.equal([0])
    expect([...count(5)]).to.deep.equal([0, 1, 2, 3, 4])
  })

  it('times() seems to work', () => {
    expect([...times(0, x => x * 2)]).to.deep.equal([])
    expect([...times(3, x => x * 2)]).to.deep.equal([0, 2, 4])
    expect([...times(3, x => `${x}`)]).to.deep.equal(['0', '1', '2'])
  })
})
