// stores a value for a given duration, then reverts to undefined if it hasn't been updated recently enough
export default function cache (durationSecs = 60) {
  let stored:any = undefined
  let timeout = undefined

  return {
    get: () => stored,
    set: (value) => {
      if (timeout) clearTimeout(timeout)
      stored = value
      timeout = setTimeout(() => stored = undefined, (durationSecs * 1000))
      return value
    }
  }
}

/**
 * returns the last value immediately, then updates for the next request
 * if called again before update returns a new value, old value keeps being returned
 */
export function immediateResponseCache<Ret, Args extends any[]> (loadNewValue: (...args: Args) => Promise<Ret>): (...args: Args) => Promise<Ret> {
  let nextPromise: Promise<Ret>
  let initialized = false
  let updating = false

  return (...args) => {
    if (!updating) {
      updating = true
      const next = loadNewValue(...args)
      if (initialized) {
        next.then(x => {
          updating = false
          initialized = true
          nextPromise = Promise.resolve(x)
        }).catch(err => {
          updating = false
          initialized = true
          nextPromise = Promise.reject(err)
        })
      } else {
        nextPromise = next
        return next
      }
    }

    return nextPromise
  }
}
