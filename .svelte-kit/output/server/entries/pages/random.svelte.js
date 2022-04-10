import { c as create_ssr_component, v as validate_component } from "../../chunks/index-221b5e23.js";
import { H as Header } from "../../chunks/Header-42cee668.js";
/* empty css                                                              *//* empty css                                                             */import { S as Spinner } from "../../chunks/Spinner-3f422681.js";
import "../../chunks/index-00ee18ac.js";
/* empty css                                                           */var random_svelte_svelte_type_style_lang = "";
const css = {
  code: '*{box-sizing:border-box}body{max-width:900px;margin-left:auto;margin-right:auto;font-family:"Helvetica Neue", Helvetica, Arial, sans-serif;background-color:var(--base-bg);color:var(--base-fg)}h2.svelte-140bzfi button.svelte-140bzfi{--button-hue:calc(var(--hue) - 45deg);width:100%;display:block;background-color:hsl(var(--button-hue), var(--module-bg-sat), var(--module-bg-lum));color:hsl(var(--button-hue), var(--base-fg-sat), var(--base-fg-lum));appearance:none;padding:1ex 1em;border-radius:calc((1em + 2ex) / 2);line-height:1;border:0 none;font-size:inherit;font-weight:inherit}h2.svelte-140bzfi button.svelte-140bzfi:enabled:hover{background-color:hsl(var(--button-hue), var(--submodule-bg-sat), var(--submodule-bg-lum));cursor:pointer}.spacer.svelte-140bzfi.svelte-140bzfi{height:200vh}',
  map: null
};
const Random = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let result;
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    {
      console.log(result);
    }
    $$rendered = `${$$result.head += `${$$result.title = `<title>Random Sign</title>`, ""}`, ""}



${validate_component(Header, "Header").$$render($$result, {}, {}, {})}

<main><h1>Random Sign Generator</h1>

  <h2 class="${"svelte-140bzfi"}"><button ${"disabled"} class="${"svelte-140bzfi"}">\u{1F3B2} Reroll</button></h2>

  ${`<div class="${"spacer svelte-140bzfi"}">${validate_component(Spinner, "Spinner").$$render($$result, {}, {}, {})}</div>`}

  <div style="${"height: 20em"}"></div>
</main>`;
  } while (!$$settled);
  return $$rendered;
});
export { Random as default };
