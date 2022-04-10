import { b as base } from "./paths-396f020f.js";
import { i as iter_decode } from "./index-00ee18ac.js";
import { s as siteConfig } from "./site-config-a846d353.js";
async function* readUpdateLog(fetch2) {
  const response = await fetch2(siteConfig.updateLog);
  yield* iter_decode(await response.arrayBuffer());
}
async function getUpdatesFeed({ page = 0, length = 30, url, extended = false }) {
  let updates = [];
  for await (const entry of readUpdateLog(fetch)) {
    if (entry.available)
      updates.push(entry);
  }
  updates = updates.sort((a, b) => b.timestamp - a.timestamp);
  updates = updates.slice(length * page, length * (page + 1));
  const version = "https://jsonfeed.org/version/1.1";
  const title = "Sign Language Updates";
  const home_page_url = new URL(base, url).toString();
  const feed_url = new URL("?page=0", url).toString();
  const next_url = updates.length ? new URL(`?page=${page + 1}`, url).toString() : null;
  return {
    version,
    title,
    home_page_url,
    feed_url,
    next_url,
    items: updates.map((entry) => ({
      id: `${entry.provider}:${entry.id}`,
      title: `${entry.provider} ${entry.verb}: ${[...entry.words].flat(2).join(" ").trim()}`,
      url: new URL(`/entries/${encodeURIComponent(entry.provider)}/${encodeURIComponent(entry.id)}`, url).toString(),
      external_url: entry.link,
      authors: [{ name: entry.provider, url: entry.providerLink }],
      date_published: new Date(entry.timestamp).toISOString(),
      content_text: `${entry.body}`,
      attachments: [],
      ...extended ? {
        __fs_verb: entry.verb,
        __fs_words: entry.words
      } : {}
    }))
  };
}
export { getUpdatesFeed as g };
