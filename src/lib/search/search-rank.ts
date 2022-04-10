// augments search-index with rank properties, and sorts by rank
import type { Library } from "./search-index"

export default function rank (library: Library, filterFn): Library {
  const rankedLibrary = Object.create(library)
  rankedLibrary.index = library.index.flatMap(entry => {
    const rank = filterFn(entry)
    if (typeof rank === 'number' && rank < Infinity) {
      const rankedEntry = Object.create(entry)
      rankedEntry.rank = rank + (rankedEntry.diversity * 0.05)
      return [rankedEntry]
    } else {
      return []
    }
  }).sort((x, y) => {
    return x.rank - y.rank
  })
  return rankedLibrary
}
