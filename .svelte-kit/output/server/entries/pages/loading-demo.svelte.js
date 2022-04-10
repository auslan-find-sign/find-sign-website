import { c as create_ssr_component, v as validate_component } from "../../chunks/index-221b5e23.js";
import { S as Spinner } from "../../chunks/Spinner-3f422681.js";
/* empty css                                                           */const Loading_demo = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let active = true;
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${validate_component(Spinner, "Spinner").$$render($$result, { active }, {
      active: ($$value) => {
        active = $$value;
        $$settled = false;
      }
    }, {})}

<button>load</button>
<button>finish</button>`;
  } while (!$$settled);
  return $$rendered;
});
export { Loading_demo as default };
