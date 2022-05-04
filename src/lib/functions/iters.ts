export function * times<Type> (count: number, fn: (i: number) => Type): Generator<Type> {
  for (let i = 0; i < count; i++) {
    yield fn(i)
  }
}

export function * count (count: number) {
  yield * times(count, i => i)
}