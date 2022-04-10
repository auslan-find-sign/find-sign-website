import { g as getUpdatesFeed } from "../../../chunks/_read-discovery-feed-1e7be009.js";
import encode from "pigeonmark-xml/library/encode.js";
import "../../../chunks/paths-396f020f.js";
import "../../../chunks/index-00ee18ac.js";
import "../../../chunks/site-config-a846d353.js";
const length = 25;
async function get({ url }) {
  const page = parseInt(url.searchParams.get("page") || "0");
  const jsonFeed = await getUpdatesFeed({ url, page, length });
  const body = encode([
    "#document",
    { xmlpi: [["?xml", { version: "1.0", encoding: "utf-8" }]] },
    [
      "feed",
      { xmlns: "http://www.w3.org/2005/Atom" },
      ["id", jsonFeed.feed_url],
      ["title", jsonFeed.title],
      ["updated", new Date().toISOString()],
      ["link", { rel: "alternate", type: "text/html", href: jsonFeed.home_page_url }],
      ["link", { rel: "self", type: "application/atom+xml", href: jsonFeed.feed_url }],
      ...jsonFeed.next_url ? [
        ["link", { rel: "next", href: jsonFeed.next_url }]
      ] : [],
      ...jsonFeed.items.map((item) => [
        "entry",
        ["id", item.external_url],
        ["title", item.title],
        ["updated", item.date_published],
        ...item.authors.map((author) => [
          "author",
          ["name", author.name],
          ["uri", author.url]
        ]),
        ["link", { rel: "alternate", href: item.url }],
        ["link", { rel: "via", href: item.external_url }],
        ["content", { type: "text" }, item.content_text],
        ...item.attachments.map((media) => ["link", { rel: "enclosure", title: media.title, href: media.url, type: media.mime_type, length: media.size_in_bytes }])
      ])
    ]
  ]);
  return { headers: { "content-type": "application/atom+xml; charset=UTF-8" }, body };
}
export { get };
