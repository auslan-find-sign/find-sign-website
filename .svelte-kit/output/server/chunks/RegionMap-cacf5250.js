import { c as create_ssr_component, e as escape, n as null_to_empty, b as add_attribute, o as each } from "./index-221b5e23.js";
/* empty css                                                  */var url = "/_app/assets/auslan-map-0d3bf463.svg";
const css = {
  code: "svg.svelte-1nj8wrw.svelte-1nj8wrw{fill:hsla(var(--hue), var(--base-fg-sat), var(--base-fg-lum), 0.25);stroke:var(--module-bg);stroke-width:2px}svg.svelte-1nj8wrw use.active.svelte-1nj8wrw{fill:var(--base-fg)}svg.editable.svelte-1nj8wrw use.svelte-1nj8wrw{cursor:pointer;pointer-events:fill}",
  map: null
};
const RegionMap = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const regions = ["wa", "nt", "sa", "qld", "nsw", "vic", "tas"];
  let { tags = [] } = $$props;
  let { width = "100%" } = $$props;
  let { height = "100%" } = $$props;
  let { editable = false } = $$props;
  if ($$props.tags === void 0 && $$bindings.tags && tags !== void 0)
    $$bindings.tags(tags);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.editable === void 0 && $$bindings.editable && editable !== void 0)
    $$bindings.editable(editable);
  $$result.css.add(css);
  return `


<svg class="${[
    escape(null_to_empty($$props.class)) + " svelte-1nj8wrw",
    editable ? "editable" : ""
  ].join(" ").trim()}" viewBox="${"0 0 512 480"}"${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("style", $$props.style, 0)}>${each(regions, (region) => {
    return `<use${add_attribute("href", `${url}#${region}`, 0)} class="${["svelte-1nj8wrw", tags.includes(region) ? "active" : ""].join(" ").trim()}"></use>`;
  })}</svg>`;
});
export { RegionMap as R };
