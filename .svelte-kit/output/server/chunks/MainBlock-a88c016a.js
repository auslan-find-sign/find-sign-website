import { c as create_ssr_component } from "./index-221b5e23.js";
var MainBlock_svelte_svelte_type_style_lang = "";
const css = {
  code: "main.svelte-14ymo0n{max-width:500px;min-height:300px;margin:0 auto 3em auto;padding:0.5rem 0.5rem 0.5rem 0.9rem;line-height:1.35em;background-color:var(--module-bg);border-radius:1rem;border:3px solid var(--module-bg);color:var(--module-fg);overflow:hidden;box-shadow:0.3rem 0.6rem 0.8rem hsla(var(--hue), calc(var(--base-bg-sat) + 5%), calc(var(--base-bg-lum) - 6%), var(--outer-shadow-alpha)),\n    0.3rem 0.5rem 1.0rem hsla(var(--hue), calc(var(--base-bg-sat) + 5%), calc(var(--base-bg-lum) - 4%), var(--outer-shadow-alpha)),\n    0.3rem 0.4rem 1.2rem hsla(var(--hue), calc(var(--base-bg-sat) + 5%), calc(var(--base-bg-lum) - 2%), var(--outer-shadow-alpha)),\n    /* outside top highlight */\n    -0.3rem -0.6rem 0.8rem hsla(var(--hue), calc(var(--base-bg-sat) - 5%), calc(var(--base-bg-lum) + 6%), var(--outer-highlight-alpha)),\n    -0.3rem -0.5rem 1.0rem hsla(var(--hue), calc(var(--base-bg-sat) - 5%), calc(var(--base-bg-lum) + 4%), var(--outer-highlight-alpha)),\n    -0.3rem -0.4rem 1.2rem hsla(var(--hue), calc(var(--base-bg-sat) - 5%), calc(var(--base-bg-lum) + 2%), var(--outer-highlight-alpha))\n    }main.wide.svelte-14ymo0n{max-width:900px}main.svelte-14ymo0n a{color:inherit}",
  map: null
};
const MainBlock = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { wide = false } = $$props;
  if ($$props.wide === void 0 && $$bindings.wide && wide !== void 0)
    $$bindings.wide(wide);
  $$result.css.add(css);
  return `<main class="${["svelte-14ymo0n", wide ? "wide" : ""].join(" ").trim()}">${slots.default ? slots.default({}) : ``}
</main>`;
});
export { MainBlock as M };
