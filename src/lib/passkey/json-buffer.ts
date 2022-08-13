/**
 * encodes an object in to a json string, where all Uint8Array and Node Buffers are
 * converted to 'bytes:num,num,num' strings and all plain strings are prefixed with
 * 'string:', allowing easy transport of short Uint8Arrays over json
 * @param object
 * @returns {string}
 */
export function stringify (object: string | number | boolean | any[] | object | null): string {
  return JSON.stringify(object, (_, value) => {
    if (value && typeof value === 'object' && value instanceof Uint8Array) {
      return `bytes:${[...value].map(x => `${x}`).join(',')}`
    } else if (value && typeof value === 'object' && (value.type === 'Buffer' || value.type === 'string:Buffer')) {
      return `bytes:${[...value.data].map(x => `${x}`).join(',')}`
    } else if (typeof value === 'string') {
      return `string:${value}`
    } else {
      return value
    }
  })
}

/**
 * decodes an object that was encoded using the stringify function in this module, using Uint8Array
 * to represent bytes: values
 * @param json {string}
 * @returns {string | number | boolean | any[] | object | null}
 */
export function parse (json: string): string | number | boolean | any[] | object | null {
  return JSON.parse(json, (_, value) => {
    if (typeof value === 'string') {
      if (value.startsWith('bytes:')) {
        const bytes = value.slice('bytes:'.length).split(',').map(x => parseInt(x))
        return new Uint8Array(bytes)
      } else if (value.startsWith('string:')) {
        return value.slice('string:'.length)
      }
    }
    return value
  })
}
