import { c as create_ssr_component, v as validate_component, e as escape } from "../../chunks/index-221b5e23.js";
import { R as RegionMap } from "../../chunks/RegionMap-cacf5250.js";
/* empty css                                                             */const Test_map_editor = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { tags = [] } = $$props;
  if ($$props.tags === void 0 && $$bindings.tags && tags !== void 0)
    $$bindings.tags(tags);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `<div>${validate_component(RegionMap, "RegionMap").$$render($$result, {
      editable: true,
      width: "250",
      height: "250",
      tags
    }, {
      tags: ($$value) => {
        tags = $$value;
        $$settled = false;
      }
    }, {})}

  <h2>tags:</h2>
  <p>${escape(JSON.stringify(tags))}</p></div>`;
  } while (!$$settled);
  return $$rendered;
});
export { Test_map_editor as default };
