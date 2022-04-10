import { c as create_ssr_component, e as escape, n as null_to_empty, b as add_attribute, o as each, v as validate_component } from "./index-221b5e23.js";
/* empty css                                                   */import { R as RegionMap } from "./RegionMap-cacf5250.js";
import { I as Icon } from "./Header-42cee668.js";
const css$1 = {
  code: "div.svelte-1ljaekx.svelte-1ljaekx{display:grid;grid-template-columns:32px auto 32px;grid-template-rows:auto;background-color:var(--submodule-bg);border-radius:6px;width:100%;aspect-ratio:16 / 9;overflow:hidden;box-shadow:inset 0 -7rem 5em -2em hsla(var(--hue), calc(var(--module-bg-sat) - 5%), calc(var(--module-bg-lum) + 5%), var(--outer-highlight-alpha)),\n      inset 0 +7rem 5em -2em hsla(var(--hue), calc(var(--module-bg-sat) + 5%), calc(var(--module-bg-lum) - 3%), var(--outer-shadow-alpha)),\n      /* outside drop shadow */\n      0.3rem 0.3rem 0.4rem hsla(var(--hue), calc(var(--module-bg-sat) + 5%), calc(var(--module-bg-lum) - 10%), var(--outer-shadow-alpha)),\n      0.2rem 0.3rem 0.2rem hsla(var(--hue), calc(var(--module-bg-sat) + 5%), calc(var(--module-bg-lum) - 8%), var(--outer-shadow-alpha)),\n      0.1rem 0.1rem 0.1rem hsla(var(--hue), calc(var(--module-bg-sat) + 5%), calc(var(--module-bg-lum) - 6%), var(--outer-shadow-alpha)),\n      /* outside top highlight */\n      -0.3rem -0.3rem 0.4rem hsla(var(--hue), calc(var(--module-bg-sat) - 5%), calc(var(--module-bg-lum) + 6%), var(--outer-highlight-alpha)),\n      -0.2rem -0.2rem 0.2rem hsla(var(--hue), calc(var(--module-bg-sat) - 5%), calc(var(--module-bg-lum) + 4%), var(--outer-highlight-alpha)),\n      -0.1rem -0.1rem 0.1rem hsla(var(--hue), calc(var(--module-bg-sat) - 5%), calc(var(--module-bg-lum) + 2%), var(--outer-highlight-alpha))\n    }div.svelte-1ljaekx>a.svelte-1ljaekx{grid-row:1;grid-column:1 / 4;overflow:hidden}video.svelte-1ljaekx.svelte-1ljaekx,picture.svelte-1ljaekx.svelte-1ljaekx{display:block;width:100%;height:100%;border-radius:6px;z-index:5;aspect-ratio:16 / 9}button.svelte-1ljaekx.svelte-1ljaekx,button.svelte-1ljaekx.svelte-1ljaekx{grid-row:1;z-index:10;border:0 none;padding:0;font-size:inherit;font-weight:inherit;font-family:inherit;color:inherit;background-color:hsla(var(--hue), var(--module-bg-sat), var(--module-bg-lum), 40%)}button.prev.svelte-1ljaekx.svelte-1ljaekx{grid-column:1;border-top-left-radius:4px;border-bottom-left-radius:4px}button.next.svelte-1ljaekx.svelte-1ljaekx{grid-column:3;border-top-right-radius:4px;border-bottom-right-radius:4px}",
  map: null
};
const TinyMediaCarousel = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let media;
  let type;
  let { medias = [] } = $$props;
  let { selected = 0 } = $$props;
  let { link = void 0 } = $$props;
  if ($$props.medias === void 0 && $$bindings.medias && medias !== void 0)
    $$bindings.medias(medias);
  if ($$props.selected === void 0 && $$bindings.selected && selected !== void 0)
    $$bindings.selected(selected);
  if ($$props.link === void 0 && $$bindings.link && link !== void 0)
    $$bindings.link(link);
  $$result.css.add(css$1);
  media = medias[selected];
  type = media[0].type.split("/")[0];
  return `

<div class="${escape(null_to_empty($$props.class)) + " svelte-1ljaekx"}"><a${add_attribute("href", link, 0)} referrerpolicy="${"origin"}" rel="${"external"}" class="${"svelte-1ljaekx"}">${type === "video" ? `<video muted preload="${"auto"}" autoplay loop playsinline class="${"svelte-1ljaekx"}">${each(media, (source) => {
    return `<source${add_attribute("src", source.src, 0)}${add_attribute("type", source.type, 0)}>`;
  })}</video>` : `${type === "image" ? `<picture class="${"svelte-1ljaekx"}">${each(media, (source) => {
    return `<source${add_attribute("src", source.src, 0)}${add_attribute("type", source.type, 0)}>`;
  })}</picture>` : ``}`}</a>

  ${selected > 0 ? `<button class="${"prev svelte-1ljaekx"}" aria-label="${"Previous Video"}">\u276E</button>` : ``}
  ${selected < medias.length - 1 ? `<button class="${"next svelte-1ljaekx"}" aria-label="${"Next Video"}">\u276F</button>` : ``}
</div>`;
});
const css = {
  code: '.result.svelte-12ylr6y.svelte-12ylr6y{background-color:var(--module-bg);border-radius:10px;margin-top:1.1em;color:inherit;text-decoration:none;overflow:hidden;padding:1ex;box-shadow:inset 0 -7rem 5em -2em hsla(var(--hue), calc(var(--module-bg-sat) - 5%), calc(var(--module-bg-lum) + 5%), var(--outer-highlight-alpha)),\n    inset 0 +7rem 5em -2em hsla(var(--hue), calc(var(--module-bg-sat) + 5%), calc(var(--module-bg-lum) - 3%), var(--outer-shadow-alpha)),\n    /* outside drop shadow */\n    0.3rem 0.3rem 0.4rem hsla(var(--hue), calc(var(--base-bg-sat) + 5%), calc(var(--base-bg-lum) - 10%), var(--outer-shadow-alpha)),\n    0.2rem 0.3rem 0.2rem hsla(var(--hue), calc(var(--base-bg-sat) + 5%), calc(var(--base-bg-lum) - 8%), var(--outer-shadow-alpha)),\n    0.1rem 0.1rem 0.1rem hsla(var(--hue), calc(var(--base-bg-sat) + 5%), calc(var(--base-bg-lum) - 6%), var(--outer-shadow-alpha)),\n    /* outside top highlight */\n    -0.3rem -0.3rem 0.4rem hsla(var(--hue), calc(var(--base-bg-sat) - 5%), calc(var(--base-bg-lum) + 6%), var(--outer-highlight-alpha)),\n    -0.2rem -0.2rem 0.2rem hsla(var(--hue), calc(var(--base-bg-sat) - 5%), calc(var(--base-bg-lum) + 4%), var(--outer-highlight-alpha)),\n    -0.1rem -0.1rem 0.1rem hsla(var(--hue), calc(var(--base-bg-sat) - 5%), calc(var(--base-bg-lum) + 2%), var(--outer-highlight-alpha))\n    }.words.svelte-12ylr6y.svelte-12ylr6y{line-height:1em;margin:0;grid-area:title;font-size:1.3rem;font-weight:normal;text-transform:capitalize;text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.words.svelte-12ylr6y a.svelte-12ylr6y{text-decoration:none;color:inherit}.result.svelte-12ylr6y .map{width:2em;height:2em;stroke-width:5px}.heading.svelte-12ylr6y.svelte-12ylr6y{grid-area:heading;display:grid;grid-template-columns:auto max-content;grid-template-areas:"datas icons"}.heading.svelte-12ylr6y>.datas.svelte-12ylr6y{grid-area:datas;overflow:hidden}.heading.svelte-12ylr6y>.datas .svelte-12ylr6y{text-overflow:ellipsis}.heading.svelte-12ylr6y>.icons.svelte-12ylr6y{grid-area:icons;display:grid;grid-auto-flow:column;grid-auto-columns:2em;grid-template-rows:2em;place-items:center}.heading.svelte-12ylr6y .permalink.svelte-12ylr6y{text-align:center;opacity:0.5 }.heading.svelte-12ylr6y .permalink.svelte-12ylr6y:hover{opacity:1.0 }.link.svelte-12ylr6y.svelte-12ylr6y{grid-area:breadcrumbs}.tags.svelte-12ylr6y.svelte-12ylr6y{grid-area:hashtags}.alerts.svelte-12ylr6y.svelte-12ylr6y{grid-area:alerts}.body.svelte-12ylr6y.svelte-12ylr6y{grid-area:body}.result.svelte-12ylr6y.svelte-12ylr6y:not(.expand){display:grid;grid-template-columns:250px 1ex auto;min-height:158px;grid-template-areas:"media gap heading"\n      "media gap body"}.result.expand.svelte-12ylr6y.svelte-12ylr6y{display:grid;grid-template-columns:auto;grid-template-rows:auto 1ex auto auto;grid-template-areas:"media"\n      "gap"\n      "heading"\n      "body"}.result.svelte-12ylr6y .carousel{grid-area:media}.link.svelte-12ylr6y.svelte-12ylr6y,.tags.svelte-12ylr6y.svelte-12ylr6y{text-overflow:ellipsis;font-size:80%;white-space:nowrap;overflow:hidden}.link.svelte-12ylr6y a.svelte-12ylr6y{text-decoration:underline;font-style:normal;color:inherit}.link.svelte-12ylr6y a.svelte-12ylr6y:not(:first-child):before{content:"/";padding-left:0.7ex;padding-right:0.7ex;display:inline-block}.body.svelte-12ylr6y.svelte-12ylr6y{--line-height:1.4em;--visible-lines:4.65;text-overflow:ellipsis;white-space:pre-line;overflow:hidden;line-height:var(--line-height);font-size:0.95em;max-height:calc(var(--line-height) * var(--visible-lines) - 1rem)}.result.expand.svelte-12ylr6y .body.svelte-12ylr6y{max-height:unset}.result.invented.svelte-12ylr6y.svelte-12ylr6y{background-color:var(--alert-bg)}.result.svelte-12ylr6y .alert .svelte-12ylr6y:first-child{vertical-align:-0.2ex}@media(max-width: 600px){div.result.svelte-12ylr6y.svelte-12ylr6y:not(.expand){display:grid;grid-template-columns:auto;grid-template-rows:auto 1ex auto auto;grid-template-areas:"media"\n        "gap"\n        "heading"\n        "body"}div.result.svelte-12ylr6y:not(.expand) .body.svelte-12ylr6y{max-height:unset}}',
  map: null
};
function* getWarnings(tags) {
  if (tags.includes("invented"))
    yield {
      text: "Informal, colloqual sign. Professionals should not use."
    };
}
const ResultTile = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let warnings;
  let { data = void 0 } = $$props;
  let { expand = false } = $$props;
  let { permalink = void 0 } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.expand === void 0 && $$bindings.expand && expand !== void 0)
    $$bindings.expand(expand);
  if ($$props.permalink === void 0 && $$bindings.permalink && permalink !== void 0)
    $$bindings.permalink(permalink);
  $$result.css.add(css);
  warnings = data ? [...getWarnings(data.tags)] : [];
  return `<div class="${[
    escape(null_to_empty($$props.class)) + " svelte-12ylr6y",
    "result " + (!data ? "placeholder" : "") + " " + (expand ? "expand" : "")
  ].join(" ").trim()}">${data ? `${validate_component(TinyMediaCarousel, "Carousel").$$render($$result, {
    medias: data.media,
    link: data.link,
    class: "carousel"
  }, {}, {})}

    <div class="${"heading svelte-12ylr6y"}"><div class="${"datas svelte-12ylr6y"}"><h2 class="${"words svelte-12ylr6y"}"><a${add_attribute("href", data.link, 0)} referrerpolicy="${"origin"}" rel="${"external"}" class="${"svelte-12ylr6y"}">${escape(data.title || data.keywords.join(", "))}</a></h2>

        <cite class="${"link svelte-12ylr6y"}">${data.nav && data.nav.length > 0 ? `${each(data.nav, ([name, url]) => {
    return `<a${add_attribute("href", url, 0)} referrerpolicy="${"origin"}" rel="${"external"}" class="${"svelte-12ylr6y"}">${escape(name)}</a>`;
  })}` : `<a${add_attribute("href", data.link, 0)} class="${"svelte-12ylr6y"}">${escape(data.link)}</a>`}</cite>

        ${data.tags && data.tags.length > 0 ? `<div class="${"tags svelte-12ylr6y"}">${each(data.tags, (tag) => {
    return `${escape(`#${tag} `)}`;
  })}</div>` : ``}</div>

      <div class="${"icons svelte-12ylr6y"}">${permalink ? `<a class="${"permalink svelte-12ylr6y"}"${add_attribute("href", permalink, 0)}>${validate_component(Icon, "Icon").$$render($$result, { name: "link" }, {}, {})}</a>` : ``}

        ${["wa", "nt", "sa", "qld", "nsw", "act", "vic", "tas"].some((x) => data.tags.includes(x)) ? `${validate_component(RegionMap, "RegionMap").$$render($$result, { tags: data.tags, class: "map" }, {}, {})}` : ``}</div></div>

    <div class="${"body svelte-12ylr6y"}">${warnings.length > 0 ? `<div class="${"alerts svelte-12ylr6y"}">${each(warnings, (warning) => {
    return `<div class="${"alert " + escape(warning.type) + " svelte-12ylr6y"}">${validate_component(Icon, "Icon").$$render($$result, { name: warning.icon || "alert" }, {}, {})}
              ${escape(warning.text)}
            </div>`;
  })}</div>` : ``}
      ${escape(data.body || "")}</div>` : ``}
</div>`;
});
export { ResultTile as R };
