import { c as create_ssr_component, v as validate_component } from "../../chunks/index-221b5e23.js";
import { H as Header } from "../../chunks/Header-42cee668.js";
import { M as MainBlock } from "../../chunks/MainBlock-a88c016a.js";
/* empty css                                                           */var DiscoveryFeed_svelte_svelte_type_style_lang = "";
const css = {
  code: "div.loading.svelte-47h3e6{display:grid;height:calc(300px - 1rem - 6px)}div.loading.svelte-47h3e6>.spinner{justify-content:center;align-content:center;height:100%}a.icon-feed.svelte-47h3e6{display:block;width:1em;height:1em;float:right}h2.svelte-47h3e6,div.discovery-link.svelte-47h3e6{font-size:1em;margin:0;padding:0}div.discovery-link.svelte-47h3e6{display:list-item;list-style-position:inside;list-style-type:square;padding-left:0.5em}time.entry-timestamp.svelte-47h3e6{display:none}",
  map: null
};
const DiscoveryFeed = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${$$result.head += `<link rel="${"alternate"}" title="${"Recently Added (JSON)"}" type="${"application/json"}" href="${"/feeds/discovery.json"}" data-svelte="svelte-9ewjcx"><link rel="${"alternate"}" title="${"Recently Added (Atom)"}" type="${"application/atom+xml"}" href="${"/feeds/discovery.atom"}" data-svelte="svelte-9ewjcx"><link rel="${"alternate"}" title="${"Recently Added (RSS)"}" type="${"application/rss+xml"}" href="${"/feeds/discovery.rss"}" data-svelte="svelte-9ewjcx">`, ""}

${validate_component(MainBlock, "MainBlock").$$render($$result, {}, {}, {
    default: () => {
      return `${`<div class="${"loading svelte-47h3e6"}">${``}</div>`}`;
    }
  })}`;
});
const prerender = true;
const Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `${$$result.title = `<title>Find Sign</title>`, ""}<meta property="${"og:image"}" content="${"https://find.auslan.fyi/style/assets/open-graph-image@3x.png"}" data-svelte="svelte-67yohp"><meta property="${"og:description"}" content="${"Find Sign is an Auslan Search Engine. It helps find Auslan resources from around the internet in one place."}" data-svelte="svelte-67yohp"><meta property="${"og:title"}" content="${"Find Sign - Auslan Search Engine"}" data-svelte="svelte-67yohp">`, ""}

${validate_component(Header, "Header").$$render($$result, {}, {}, {})}

${validate_component(DiscoveryFeed, "DiscoveryFeed").$$render($$result, {}, {}, {})}`;
});
export { Routes as default, prerender };
