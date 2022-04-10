import { c as create_ssr_component, e as escape, n as null_to_empty, b as add_attribute, v as validate_component } from "./index-221b5e23.js";
var logo = "/_app/assets/find-sign-logo-b75877a8.svg";
var symbols = "/_app/assets/symbol-defs-a3addf78.svg";
var Icon_svelte_svelte_type_style_lang = "";
const css$2 = {
  code: "svg.svelte-1xe47l4{fill:currentColor;width:1em;height:1em}",
  map: null
};
const Icon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { name } = $$props;
  let { ariaHidden = false } = $$props;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.ariaHidden === void 0 && $$bindings.ariaHidden && ariaHidden !== void 0)
    $$bindings.ariaHidden(ariaHidden);
  $$result.css.add(css$2);
  return `<svg class="${escape(null_to_empty($$props.class)) + " svelte-1xe47l4"}"${add_attribute("style", $$props.style, 0)} aria-label="${escape(name) + " icon"}"${add_attribute("aria-hidden", ariaHidden, 0)}><use href="${escape(symbols) + "#icon-" + escape(name)}"></use></svg>`;
});
var SearchInput_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: "form.svelte-1n0xyrt{--square:calc(3.6rem - 6px);display:grid;grid-template-columns:var(--square) auto;grid-template-rows:var(--square);grid-auto-columns:var(--square);align-items:center;justify-items:center;font-size:1.6em;margin:0 auto 0 auto;border-radius:1.8rem;background-image:var(--noise-texture);background-color:var(--module-bg);background-blend-mode:multiply;border:3px solid var(--module-bg);box-shadow:inset 0.35rem 0.3rem 0.6rem -0.3rem hsla(var(--hue), calc(var(--module-bg-sat) + 4%), calc(var(--module-bg-lum) - 8%), 100%),\n      inset 0.30rem 0.4rem 0.7rem -0.3rem hsla(var(--hue), calc(var(--module-bg-sat) + 4%), calc(var(--module-bg-lum) - 8%), 100%),\n      inset 0.25rem 0.5rem 0.8rem -0.3rem hsla(var(--hue), calc(var(--module-bg-sat) + 4%), calc(var(--module-bg-lum) - 8%), 100%),\n      inset 0.05rem 10rem  10rem   0rem   hsla(var(--hue), calc(var(--module-bg-sat) + 4%), calc(var(--module-bg-lum) - 8%), var(--outer-shadow-alpha)),\n      /* inset highlight */\n      inset -0.35rem -0.3rem 0.6rem -0.3rem hsla(var(--hue), calc(var(--module-bg-sat) - 2%), calc(var(--module-bg-lum) + 4%), 100%),\n      inset -0.30rem -0.4rem 0.7rem -0.3rem hsla(var(--hue), calc(var(--module-bg-sat) - 2%), calc(var(--module-bg-lum) + 4%), 100%),\n      inset -0.25rem -0.5rem 0.8rem -0.3rem hsla(var(--hue), calc(var(--module-bg-sat) - 2%), calc(var(--module-bg-lum) + 4%), 100%),\n      inset -0.05rem -10rem  10rem   0rem   hsla(var(--hue), calc(var(--module-bg-sat) - 2%), calc(var(--module-bg-lum) + 4%), var(--outer-highlight-alpha)),\n      /* outside drop shadow */\n      0.3rem 0.6rem 0.8rem hsla(var(--hue), calc(var(--base-bg-sat) + 5%), calc(var(--base-bg-lum) - 6%), var(--outer-shadow-alpha)),\n      0.3rem 0.5rem 1.0rem hsla(var(--hue), calc(var(--base-bg-sat) + 5%), calc(var(--base-bg-lum) - 4%), var(--outer-shadow-alpha)),\n      0.3rem 0.4rem 1.2rem hsla(var(--hue), calc(var(--base-bg-sat) + 5%), calc(var(--base-bg-lum) - 2%), var(--outer-shadow-alpha)),\n      /* outside top highlight */\n      -0.3rem -0.6rem 0.8rem hsla(var(--hue), calc(var(--base-bg-sat) - 5%), calc(var(--base-bg-lum) + 6%), var(--outer-highlight-alpha)),\n      -0.3rem -0.5rem 1.0rem hsla(var(--hue), calc(var(--base-bg-sat) - 5%), calc(var(--base-bg-lum) + 4%), var(--outer-highlight-alpha)),\n      -0.3rem -0.4rem 1.2rem hsla(var(--hue), calc(var(--base-bg-sat) - 5%), calc(var(--base-bg-lum) + 2%), var(--outer-highlight-alpha))\n    }form.svelte-1n0xyrt .icon-search{display:block;width:1em;height:1em;grid-column:1}input.svelte-1n0xyrt{display:block;grid-column:2;font-family:inherit;font-size:inherit;caret-color:var(--base-fg);background-color:transparent;color:inherit;border:0 none;outline:0 none;width:100%;height:100%}",
  map: null
};
const SearchInput = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { formAction = "/search" } = $$props;
  let { method = "GET" } = $$props;
  let { queryHandler = void 0 } = $$props;
  let { query = "" } = $$props;
  let { input = void 0 } = $$props;
  let formElement;
  if ($$props.formAction === void 0 && $$bindings.formAction && formAction !== void 0)
    $$bindings.formAction(formAction);
  if ($$props.method === void 0 && $$bindings.method && method !== void 0)
    $$bindings.method(method);
  if ($$props.queryHandler === void 0 && $$bindings.queryHandler && queryHandler !== void 0)
    $$bindings.queryHandler(queryHandler);
  if ($$props.query === void 0 && $$bindings.query && query !== void 0)
    $$bindings.query(query);
  if ($$props.input === void 0 && $$bindings.input && input !== void 0)
    $$bindings.input(input);
  $$result.css.add(css$1);
  return `<form class="${escape(null_to_empty($$props.class)) + " svelte-1n0xyrt"}"${add_attribute("style", $$props.style, 0)} role="${"search"}" autocomplete="${"off"}"${add_attribute("action", formAction, 0)}${add_attribute("method", method, 0)}${add_attribute("this", formElement, 0)}>${validate_component(Icon, "Icon").$$render($$result, { name: "search" }, {}, {})}
  <input autocomplete="${"off"}" autocapitalize="${"none"}" aria-label="${"Enter search query here."}" name="${"query"}" class="${"svelte-1n0xyrt"}"${add_attribute("this", input, 0)}${add_attribute("value", query, 0)}>
  <input type="${"hidden"}" name="${"page"}" value="${"0"}" class="${"svelte-1n0xyrt"}">
</form>`;
});
var Header_svelte_svelte_type_style_lang = "";
const css = {
  code: "header.svelte-1kdtbkf.svelte-1kdtbkf{max-width:500px;margin-left:auto;margin-right:auto}header.svelte-1kdtbkf>a.svelte-1kdtbkf{display:block;cursor:pointer;width:auto;margin-top:4rem;margin-left:auto;margin-right:auto;padding-bottom:1.5rem}@media(max-width: 500px){header.svelte-1kdtbkf>a.svelte-1kdtbkf{margin-top:13vw}}img.header.svelte-1kdtbkf.svelte-1kdtbkf{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;display:block}nav.svelte-1kdtbkf.svelte-1kdtbkf{display:flex;flex-direction:row;justify-content:space-evenly;width:auto;padding:2.5rem 0 2.5rem 0;margin:0 auto 0 auto;font-size:1.2em}@media(max-width: 350px){nav.svelte-1kdtbkf.svelte-1kdtbkf{font-size:1em}}@media(max-width: 280px){nav.svelte-1kdtbkf.svelte-1kdtbkf{display:block}nav.svelte-1kdtbkf a.svelte-1kdtbkf{display:block;text-align:center}}nav.svelte-1kdtbkf>a.svelte-1kdtbkf{color:inherit}",
  map: null
};
const Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { showNavigation = true } = $$props;
  let { query = void 0 } = $$props;
  let { formAction = "/search" } = $$props;
  if ($$props.showNavigation === void 0 && $$bindings.showNavigation && showNavigation !== void 0)
    $$bindings.showNavigation(showNavigation);
  if ($$props.query === void 0 && $$bindings.query && query !== void 0)
    $$bindings.query(query);
  if ($$props.formAction === void 0 && $$bindings.formAction && formAction !== void 0)
    $$bindings.formAction(formAction);
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `<header class="${escape(null_to_empty($$props.class)) + " svelte-1kdtbkf"}"${add_attribute("style", $$props.style, 0)}>
  <a href="${"/"}" sveltekit:prefetch class="${"svelte-1kdtbkf"}"><img class="${"header svelte-1kdtbkf"}" alt="${"Home Button"}"${add_attribute("src", logo, 0)}></a>

  
  ${validate_component(SearchInput, "SearchInput").$$render($$result, { formAction, query }, {
      query: ($$value) => {
        query = $$value;
        $$settled = false;
      }
    }, {})}

  
  ${showNavigation ? `<nav class="${"svelte-1kdtbkf"}"><a href="${"/random"}" sveltekit:prefetch class="${"svelte-1kdtbkf"}">Random</a>
      <a href="${"/about"}" sveltekit:prefetch class="${"svelte-1kdtbkf"}">About</a>
      <a href="${"/technology"}" sveltekit:prefetch class="${"svelte-1kdtbkf"}">Technology</a>
      <a href="${"https://blog.auslan.fyi/"}" class="${"svelte-1kdtbkf"}">News</a></nav>` : ``}
</header>`;
  } while (!$$settled);
  return $$rendered;
});
export { Header as H, Icon as I };
