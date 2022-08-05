import varint from 'varint'

// call a callback function count many times, with arg 0, 1, 2, 3, ...; yields each return value
export function * times<Type> (count: number, fn: (i: number) => Type): Generator<Type> {
  for (let i = 0; i < count; i++) {
    yield fn(i)
  }
}

// iterable that counts up from zero to count - 1
export function * count (count: number) {
  yield * times(count, i => i)
}

// sync version of it-length-prefixed decoder basically
export function * iterateLengthPrefixed (buffer: Uint8Array): Generator<Uint8Array> {
  let cursor = 0
  while (cursor < buffer.length) {
    const length = varint.decode(buffer, cursor)
    cursor += varint.decode.bytes
    yield buffer.subarray(cursor, cursor + length)
    cursor += length
  }
}

// returns an iterable which calls a callback with (index, times) `times` many times, returning the results of the callback
export function * timesIterable (times, callback) {
  if (times < 1) return

  let index = 0
  while (index < times) {
    yield callback(index, times)
    index += 1
  }
}

// given a sliceable object like an Array, Buffer, or String, returns an array of slices, chunkSize large, up to maxChunks or the whole thing
// the last chunk may not be full size
export function chunk<Type> (sliceable: Iterable<Type>, chunkSize: number, maxChunks = Infinity): Type[][] {
  return [...chunkIterable(sliceable, chunkSize, maxChunks)]
}

// iterable version, takes an iterable as input, and provides an iterable as output with entries grouped in to arrays
export function * chunkIterable<Type> (sliceable: Iterable<Type>, chunkSize: number, maxChunks: number = Infinity): Generator<Type[]> {
  const input = sliceable[Symbol.iterator]()
  while (maxChunks > 0) {
    const chunk = []
    while (chunk.length < chunkSize) {
      const output = input.next()
      if (output.done) {
        if (chunk.length > 0) yield chunk
        return
      } else {
        chunk.push(output.value)
      }
    }
    yield chunk
    maxChunks -= 1
  }
}

export async function * chunkIterableAsync<Type> (sliceable: AsyncIterable<Type>, chunkSize: number, maxChunks: number = Infinity): AsyncGenerator<Type[]> {
  const input = sliceable[Symbol.asyncIterator]()
  while (maxChunks > 0) {
    const chunk = []
    while (chunk.length < chunkSize) {
      const output = await input.next()
      if (output.done) {
        if (chunk.length > 0) yield chunk
        return
      } else {
        chunk.push(output.value)
      }
    }
    yield chunk
    maxChunks -= 1
  }
}

// Chunks a iterable of stringifiable values, yielding concatinated strings
export function * chunkStringIterable (string: string, chunkSize: number, maxChunks: number = Infinity) {
  for (const array of chunkIterable(string, chunkSize, maxChunks)) {
    yield array.join('')
  }
}
