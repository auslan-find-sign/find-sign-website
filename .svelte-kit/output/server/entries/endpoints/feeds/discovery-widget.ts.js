import { g as getUpdatesFeed } from "../../../chunks/_read-discovery-feed-1e7be009.js";
import { c as cache } from "../../../chunks/cache-5d5b0b54.js";
import "../../../chunks/paths-396f020f.js";
import "../../../chunks/index-00ee18ac.js";
import "../../../chunks/site-config-a846d353.js";
const cachedFeed = cache(60 * 5);
const get = async ({ url }) => {
  let body = cachedFeed.get();
  if (!body) {
    body = cachedFeed.set(await getUpdatesFeed({ url, page: 0, length: 20, extended: true }));
  }
  return {
    headers: { "content-type": "application/feed+json; charset=UTF-8" },
    body: JSON.stringify(body)
  };
};
export { get };
