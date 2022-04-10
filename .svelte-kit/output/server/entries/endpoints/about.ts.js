import { o as open } from "../../chunks/search-index-918c0118.js";
import { s as siteConfig } from "../../chunks/site-config-a846d353.js";
import { c as cache } from "../../chunks/cache-5d5b0b54.js";
import "../../chunks/index-00ee18ac.js";
const cached = cache(60 * 60);
async function get() {
  if (cached.get()) {
    return cached.get();
  } else {
    const tagAccumulator = {};
    const library = await open(siteConfig.searchIndex);
    for (const entry of library.index) {
      for (const tagName of entry.tags) {
        if (!tagAccumulator[tagName])
          tagAccumulator[tagName] = 0;
        tagAccumulator[tagName] += 1;
      }
    }
    const hashtags = Object.entries(tagAccumulator).map(([hashtag, count]) => ({ hashtag, count })).sort((left, right) => right.count - left.count);
    return cached.set({
      body: { hashtags }
    });
  }
}
export { get };
