// stores a value for a given duration, then reverts to undefined if it hasn't been updated recently enough
export default function cache (durationSecs = 60) {
  let stored:any = undefined
  let timeout = undefined

  return {
    get: () => stored,
    set: (value) => {
      if (timeout) clearTimeout(timeout)
      stored = value
      timeout = setTimeout(() => stored = undefined, (durationSecs * 60))
      return value
    }
  }
}
