import { o as open, g as getResultByPath } from "../../../../chunks/search-index-918c0118.js";
import { s as siteConfig } from "../../../../chunks/site-config-a846d353.js";
import "../../../../chunks/index-00ee18ac.js";
async function get({ params }) {
  const library = await open(siteConfig.searchIndex);
  const result = await getResultByPath(library, params.provider, params.id);
  return { body: { result } };
}
export { get };
