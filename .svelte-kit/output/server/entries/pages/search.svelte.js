import { c as create_ssr_component, o as each, b as add_attribute, v as validate_component, e as escape, p as is_promise, d as noop } from "../../chunks/index-221b5e23.js";
import { s as siteConfig } from "../../chunks/site-config-a846d353.js";
import { d as distanceSquared, b as bytesToPrefixBits, c as chunkIterable, u as unpack, m as multiply, a as build, o as open$1, e as getResult } from "../../chunks/search-index-918c0118.js";
import { i as iter_decode } from "../../chunks/index-00ee18ac.js";
import { I as Icon, H as Header } from "../../chunks/Header-42cee668.js";
import { R as ResultTile } from "../../chunks/ResultTile-9a9c3058.js";
import { S as Spinner } from "../../chunks/Spinner-3f422681.js";
/* empty css                                                              */import "../../chunks/RegionMap-cacf5250.js";
/* empty css                                                             *//* empty css                                                           */if (!Array.prototype.at) {
  Object.defineProperty(Array.prototype, "at", {
    value: function(index) {
      const O = Object(this);
      return index < 0 ? O[O.length + index] : O[index];
    }
  });
}
async function compileQuery(query, lookupVectorFn) {
  const ast = parseQuery(query);
  return await compileQueryAST(ast, lookupVectorFn);
}
async function compileQueryAST(ast, lookupVectorFn) {
  if (ast === void 0) {
    return () => 0;
  } else if (ast.type === "and") {
    const left = await compileQueryAST(ast.left, lookupVectorFn);
    const right = await compileQueryAST(ast.right, lookupVectorFn);
    return (entry) => left(entry) + right(entry);
  } else if (ast.type === "or") {
    const left = await compileQueryAST(ast.left, lookupVectorFn);
    const right = await compileQueryAST(ast.right, lookupVectorFn);
    return (entry) => Math.min(left(entry), right(entry));
  } else if (ast.type === "tag") {
    const string = ast.string;
    if (ast.positive) {
      return ({ tags: tags2 }) => tags2.includes(string) ? 0 : Infinity;
    } else {
      return ({ tags: tags2 }) => tags2.includes(string) ? Infinity : 0;
    }
  } else if (ast.type === "word") {
    const vector = ast.vector || await lookupVectorFn(ast.string);
    if (vector) {
      return ({ words: words2 }) => {
        const entryVectors = words2.filter((x) => typeof x !== "string");
        const distances = entryVectors.map((entryVector) => distanceSquared(entryVector, vector));
        return Math.min(...distances);
      };
    } else {
      const searchWord = ast.string;
      return ({ words: words2 }) => {
        return words2.some((entryString) => typeof entryString === "string" && entryString.toLowerCase() === searchWord) ? 0 : Infinity;
      };
    }
  } else {
    throw new Error("unknown ast node type");
  }
}
function tokenize(query) {
  const tokens = [""];
  for (const char of query) {
    if ('"\u201C\u201D()'.includes(char)) {
      tokens.unshift("", char);
    } else if (" 	\r\n".includes(char)) {
      tokens.unshift("");
    } else {
      tokens[0] += char;
    }
  }
  return tokens.reverse().filter((x) => x.length > 0);
}
function parseQuery(query) {
  return parseTokens(tokenize(query));
}
const parserPasses = [
  function parens(tokens) {
    const queue = [...tokens];
    const output = [];
    let inner = [];
    let depth = 0;
    while (queue.length > 0) {
      const token = queue.shift();
      if (token === "(") {
        depth += 1;
        if (depth > 1)
          inner.push(token);
        else
          inner = [];
      } else if (token === ")") {
        if (depth > 1)
          inner.push(token);
        else if (depth === 1)
          output.push(parseTokens(inner));
        depth -= 1;
      } else {
        if (depth > 0) {
          inner.push(token);
        } else {
          output.push(token);
        }
      }
    }
    return output;
  },
  function ors(tokens) {
    const output = [];
    for (const token of tokens) {
      if (output.length > 1 && output.at(-1) === "OR") {
        const type = output.pop().toLowerCase();
        const left = parseTokens([output.pop()]);
        const right = parseTokens([token]);
        output.push({ type, left, right });
      } else {
        output.push(token);
      }
    }
    return output;
  },
  function ands(tokens) {
    const output = [];
    for (const token of tokens) {
      if (output.length > 1 && output.at(-1) === "AND") {
        const type = output.pop().toLowerCase();
        const left = parseTokens([output.pop()]);
        const right = parseTokens([token]);
        output.push({ type, left, right });
      } else {
        output.push(token);
      }
    }
    return output;
  },
  function tags(tokens) {
    return tokens.map((token) => {
      if (typeof token === "string") {
        if (token.startsWith("#")) {
          return { type: "tag", string: token.slice(1), positive: true };
        } else if (token.startsWith("-#")) {
          return { type: "tag", string: token.slice(2), positive: false };
        }
      }
      return token;
    });
  },
  function words(tokens) {
    return tokens.map((token) => {
      if (typeof token === "string") {
        return { type: "word", string: token };
      } else {
        return token;
      }
    });
  },
  function implicitAnd(tokens) {
    if (tokens.length <= 1) {
      return tokens;
    } else if (tokens.length === 2) {
      return [{
        type: "and",
        left: tokens[0],
        right: tokens[1]
      }];
    } else if (tokens.length > 2) {
      return [{
        type: "and",
        left: tokens[0],
        right: implicitAnd(tokens.slice(1))
      }];
    }
  }
];
function parseTokens(tokens) {
  if (!Array.isArray(tokens))
    return tokens;
  if (tokens.length === 0)
    return void 0;
  for (const parserPass of parserPasses) {
    tokens = parserPass(tokens);
  }
  if (tokens.length === 1) {
    if (typeof tokens[0] === "string")
      throw new Error("Token Parser failed somehow, string result");
    return tokens[0];
  }
}
function rank(library, filterFn) {
  const rankedLibrary = Object.create(library);
  rankedLibrary.index = library.index.flatMap((entry) => {
    const rank2 = filterFn(entry);
    if (typeof rank2 === "number" && rank2 < Infinity) {
      const rankedEntry = Object.create(entry);
      rankedEntry.rank = rank2 + rankedEntry.diversity * 0.05;
      return [rankedEntry];
    } else {
      return [];
    }
  }).sort((x, y) => {
    return x.rank - y.rank;
  });
  return rankedLibrary;
}
async function sha256(message) {
  const msgUint8 = typeof message === "string" ? new TextEncoder().encode(message) : message;
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgUint8);
  return new Uint8Array(hashBuffer);
}
async function open(path, fetch) {
  const request = await fetch(`${path}/settings.json`, { mode: "cors", cache: "force-cache" });
  const settings = await request.json();
  return { path, settings, fetch };
}
async function lookup(library, word) {
  const hash = await sha256(word);
  const folder = parseInt(bytesToPrefixBits(hash, library.settings.prefixBits), 2);
  const file = parseInt(bytesToPrefixBits(hash, library.settings.shardBits), 2);
  const response = await library.fetch(`${library.path}/shards/${folder}/${file}.cbor`, { mode: "cors", cache: "force-cache" });
  const shard = iter_decode(await response.arrayBuffer());
  for (const [entryWord, entryScale, entryPackedVector] of chunkIterable(shard, 3)) {
    if (entryWord === word) {
      const unscaledVector = unpack(entryPackedVector, library.settings.vectorBits, library.settings.vectorSize);
      const scaledVector = multiply([unscaledVector], build(entryScale, unscaledVector.length))[0];
      return scaledVector;
    }
  }
}
var Paginator_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: "nav.svelte-ij6z6a.svelte-ij6z6a{margin:2em 0 2em 0;display:flex;flex-direction:row;justify-content:center}nav.svelte-ij6z6a a.svelte-ij6z6a{display:inline-block;font-size:2.6rem;padding:0;outline:0 none;width:60px;height:60px;text-decoration:none;text-align:center}nav.svelte-ij6z6a a[aria-current=page].svelte-ij6z6a{background-color:var(--module-bg);border-radius:30px;cursor:default;box-shadow:inset +0.1rem +0.15rem +0.4rem +0.05rem hsla(var(--hue), calc(var(--module-bg-sat) + 3%), calc(var(--module-bg-lum) - 10%), 100%),\n      inset +0.2rem +0.25rem +0.6rem +0.20rem hsla(var(--hue), calc(var(--module-bg-sat) + 3%), calc(var(--module-bg-lum) - 5%), 100%)}nav.svelte-ij6z6a a.svelte-ij6z6a svg{width:2.6rem;height:2.6rem;vertical-align:-0.2em}@media(max-width: 600px){nav.svelte-ij6z6a.svelte-ij6z6a{margin-top:1ex;justify-content:space-evenly}nav.svelte-ij6z6a a.svelte-ij6z6a{width:11vw;height:11vw;font-size:9vw;line-height:11vw}nav.svelte-ij6z6a a.svelte-ij6z6a svg{width:9vw;height:9vw;vertical-align:-1vw}nav.svelte-ij6z6a a[aria-current=page].svelte-ij6z6a{border-radius:11vw}}",
  map: null
};
const Paginator = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { length = 1 } = $$props;
  let { selected = 0 } = $$props;
  let { toURL = (pagenum) => `?page=${pagenum}` } = $$props;
  let { toAriaLabel = (pagenum) => `Go to page ${pagenum + 1}` } = $$props;
  if ($$props.length === void 0 && $$bindings.length && length !== void 0)
    $$bindings.length(length);
  if ($$props.selected === void 0 && $$bindings.selected && selected !== void 0)
    $$bindings.selected(selected);
  if ($$props.toURL === void 0 && $$bindings.toURL && toURL !== void 0)
    $$bindings.toURL(toURL);
  if ($$props.toAriaLabel === void 0 && $$bindings.toAriaLabel && toAriaLabel !== void 0)
    $$bindings.toAriaLabel(toAriaLabel);
  $$result.css.add(css$1);
  return `<nav class="${"svelte-ij6z6a"}">${each({ length }, (_, page) => {
    return `<a${add_attribute("href", toURL ? toURL(page) : "#", 0)}${add_attribute("aria-label", toAriaLabel(page), 0)}${add_attribute("aria-current", page === selected ? "page" : false, 0)} class="${"svelte-ij6z6a"}">${slots.default ? slots.default({ page: true }) : `
        ${validate_component(Icon, "Icon").$$render($$result, { name: `${page + 1}` }, {}, {})}
      `}
    </a>`;
  })}
</nav>`;
});
var search_svelte_svelte_type_style_lang = "";
const css = {
  code: ".results.svelte-6vojt7{max-width:900px;margin-left:auto;margin-right:auto}.spinner{margin-left:auto;margin-right:auto}",
  map: null
};
const resultsPerPage = 10;
const maxPages = 9;
async function load({ url, fetch }) {
  const query = url.searchParams.get("query") || "";
  const page = parseInt(url.searchParams.get("page") || "0");
  const serverRender = url.searchParams.get("ssrplz") === "yes";
  let results = [];
  let totalPages = 0;
  let searchLibrary = void 0;
  if (query.trim() === "")
    return { status: 301, redirect: "/" };
  if (serverRender) {
    searchLibrary = await open$1(siteConfig.searchIndex);
    const vectors = await open(siteConfig.vectorIndex, (...args) => fetch(...args));
    const queryFn = await compileQuery(query, (word) => lookup(vectors, word));
    console.log("queryFn", queryFn);
    const ranked = rank(searchLibrary, queryFn);
    results = ranked.index.slice(page * resultsPerPage, page * resultsPerPage + resultsPerPage);
    totalPages = Math.min(maxPages, Math.ceil(ranked.index.length / resultsPerPage));
  }
  return {
    props: {
      query,
      page,
      results,
      totalPages,
      library: searchLibrary
    }
  };
}
const Search = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { library } = $$props;
  let { query = "" } = $$props;
  let { page = 0 } = $$props;
  let { totalPages = 0 } = $$props;
  let { results = [] } = $$props;
  if ($$props.library === void 0 && $$bindings.library && library !== void 0)
    $$bindings.library(library);
  if ($$props.query === void 0 && $$bindings.query && query !== void 0)
    $$bindings.query(query);
  if ($$props.page === void 0 && $$bindings.page && page !== void 0)
    $$bindings.page(page);
  if ($$props.totalPages === void 0 && $$bindings.totalPages && totalPages !== void 0)
    $$bindings.totalPages(totalPages);
  if ($$props.results === void 0 && $$bindings.results && results !== void 0)
    $$bindings.results(results);
  $$result.css.add(css);
  return `${$$result.head += `${$$result.title = `<title>\u201C${escape(query)}\u201D - Find Sign</title>`, ""}`, ""}

${validate_component(Header, "Header").$$render($$result, { query, showNavigation: false }, {}, {})}

${results ? `<div class="${"results svelte-6vojt7"}">${each(results, (entry) => {
    return `${function(__value) {
      if (is_promise(__value)) {
        __value.then(null, noop);
        return `
        ${validate_component(ResultTile, "ResultTile").$$render($$result, {}, {}, {})}
      `;
      }
      return function(data) {
        return `
        ${validate_component(ResultTile, "ResultTile").$$render($$result, {
          data,
          permalink: "/sign/" + data.provider + "/" + data.id
        }, {}, {})}
      `;
      }(__value);
    }(getResult(library, entry))}`;
  })}</div>` : `${validate_component(Spinner, "Spinner").$$render($$result, { class: "spinner", active: true }, {}, {})}`}

${totalPages > 0 ? `${validate_component(Paginator, "Paginator").$$render($$result, {
    selected: page,
    length: totalPages,
    toURL: (page2) => `?${new URLSearchParams(Object.entries({ query, page: page2 }))}`
  }, {}, {})}` : ``}`;
});
export { Search as default, load };
