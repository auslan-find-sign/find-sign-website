/**
 * Delay until promise resolves
 */
export async function delay<Type> (duration: number, value: Type = undefined): Promise<Type> {
  await new Promise((resolve, _) => { setTimeout(() => resolve(undefined), duration) })
  return value
}

/**
 * lagSwitch will run a function, and wait for it's promise to resolve. If the promise takes
 * longer than maxDelay to resolve, it returns defaultValue instead, and calls laterDo with
 * the final value when it arrives. We can optimistically try to load slow resources, and
 * return quickly if they're taking too long, or return accurately if they're cached or fast
 *
 * If a laggy promise rejects, laterDo is called with undefined as value, and reason as second argument
 */
export async function lagSwitch<Type> (maxDelay: number, promise: Promise<Type>, defaultValue: Type, laterDo: (Type, error?: string) => any): Promise<Type> {
  return await new Promise((resolve, reject) => {
    let timeout
    const giveup = () => {
      resolve(defaultValue)
      timeout = undefined
    }
    timeout = setTimeout(giveup, maxDelay)
    promise.then(value => {
      if (timeout) {
        clearTimeout(timeout)
        resolve(value)
      } else {
        laterDo(value)
      }
    })
    promise.catch(reason => {
      if (timeout) {
        clearTimeout(timeout)
        reject(timeout)
      } else {
        laterDo(undefined, reason)
      }
    })
  })
}

export default delay
