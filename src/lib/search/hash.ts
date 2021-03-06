async function getCrypto (): Promise<SubtleCrypto> {
  if ('crypto' in globalThis) {
    return globalThis.crypto.subtle
  } else {
    /** @ts-ignore */
    return (await import('crypto')).webcrypto.subtle
  }
}

/**
 * sha256 a string or byte array
 */
export async function sha256 (message: string | Uint8Array): Promise<Uint8Array> {
  const msgUint8 = typeof message === 'string' ? new TextEncoder().encode(message) : message
  /** @ts-ignore */
  const subtle = await getCrypto()
  const hashBuffer = await subtle.digest('SHA-256', msgUint8)
  return new Uint8Array(hashBuffer)
}

/**
 * Convert a UInt8Array in to a hex string
 */
export function arrayToHex (array: Uint8Array): string {
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('')
}
