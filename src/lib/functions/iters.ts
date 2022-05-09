import varint from 'varint'

export function * times<Type> (count: number, fn: (i: number) => Type): Generator<Type> {
  for (let i = 0; i < count; i++) {
    yield fn(i)
  }
}

export function * count (count: number) {
  yield * times(count, i => i)
}

// export async function * streamAsyncIterator<Type> (stream: ReadableStream<Type> | import('node:stream').Readable): AsyncGenerator<Type> {
//   console.log(stream)
//   if (!('getReader' in stream)) {
//     // stream = ReadableStream
//     // convert node stream to web stream
//     const nodeStreams = await import('node:stream')
//     stream = nodeStreams.Readable.toWeb(stream)
//   }
//   // Get a lock on the stream
//   const reader = stream.getReader()

//   try {
//     while (true) {
//       // Read from the stream
//       const {done, value} = await reader.read()
//       // Exit if we're done
//       if (done) {
//         return
//       }
//       // Else yield the chunk
//       yield value
//     }
//   } finally {
//     reader.releaseLock()
//   }
// }

export async function * asyncIterateBuffer (buffer: ArrayBuffer) {
  yield new Uint8Array(buffer)
}

// sync version of it-length-prefixed decoder basically
export function * iterateLengthPrefixed (buffer: Uint8Array): Generator<Uint8Array> {
  while (buffer.length > 0) {
    const length = varint.decode(buffer)
    const offset = varint.decode.bytes
    yield buffer.slice(offset, offset + length)
    buffer = buffer.slice(offset + length)
  }
}