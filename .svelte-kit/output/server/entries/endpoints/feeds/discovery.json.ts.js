import { g as getUpdatesFeed } from "../../../chunks/_read-discovery-feed-1e7be009.js";
import "../../../chunks/paths-396f020f.js";
import "../../../chunks/index-00ee18ac.js";
import "../../../chunks/site-config-a846d353.js";
const get = async ({ url }) => {
  const page = parseInt(url.searchParams.get("page") || "0");
  const length = parseInt(url.searchParams.get("length") || "50");
  const body = await getUpdatesFeed({ url, page, length });
  return {
    headers: { "content-type": "application/feed+json; charset=UTF-8" },
    body: JSON.stringify(body)
  };
};
export { get };
