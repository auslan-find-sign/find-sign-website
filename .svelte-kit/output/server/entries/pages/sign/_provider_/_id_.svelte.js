import { c as create_ssr_component, v as validate_component } from "../../../../chunks/index-221b5e23.js";
import { H as Header } from "../../../../chunks/Header-42cee668.js";
import { R as ResultTile } from "../../../../chunks/ResultTile-9a9c3058.js";
/* empty css                                                                    */import "../../../../chunks/RegionMap-cacf5250.js";
/* empty css                                                                   */const U5Bidu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { result } = $$props;
  if ($$props.result === void 0 && $$bindings.result && result !== void 0)
    $$bindings.result(result);
  return `${validate_component(Header, "Header").$$render($$result, {}, {}, {})}

${validate_component(ResultTile, "ResultTile").$$render($$result, { data: result }, {}, {})}`;
});
export { U5Bidu5D as default };
