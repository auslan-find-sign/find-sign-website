import { g as getUpdatesFeed } from "../../../chunks/_read-discovery-feed-1e7be009.js";
import encode from "pigeonmark-xml/library/encode.js";
import "../../../chunks/paths-396f020f.js";
import "../../../chunks/index-00ee18ac.js";
import "../../../chunks/site-config-a846d353.js";
const length = 50;
async function get({ url }) {
  const page = parseInt(url.searchParams.get("page") || "0");
  const jsonFeed = await getUpdatesFeed({ url, page, length });
  const body = encode([
    "#document",
    { xmlpi: [["?xml", { version: "1.0" }]] },
    [
      "rss",
      { version: "2.0", "xmlns:atom": "http://www.w3.org/2005/Atom" },
      [
        "channel",
        ["title", jsonFeed.title],
        ["link", jsonFeed.home_page_url],
        ["atom:link", { rel: "self", type: "application/rss+xml", href: jsonFeed.feed_url }],
        ["description", "Discovery Feed, provides a feed of recently added new entries in the search engine"],
        ["lastBuildDate", new Date().toUTCString()],
        ["generator", "find-sign-website"],
        ...jsonFeed.items.map((item) => [
          "item",
          ["title", item.title],
          ["link", item.url],
          ["pubDate", new Date(item.date_published).toUTCString()],
          ["guid", item.external_url],
          ["description", item.content_text],
          ...item.attachments.map((media) => ["enclosure", { type: media.mime_type, url: media.url, length: media.size_in_bytes }])
        ])
      ]
    ]
  ]);
  return { headers: { "content-type": "application/rss+xml; charset=UTF-8" }, body };
}
export { get };
