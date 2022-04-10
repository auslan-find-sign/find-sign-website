import { c as create_ssr_component, v as validate_component } from "../../chunks/index-221b5e23.js";
import { H as Header } from "../../chunks/Header-42cee668.js";
import { M as MainBlock } from "../../chunks/MainBlock-a88c016a.js";
const prerender = true;
const Technology = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `${$$result.title = `<title>Find Sign Technology</title>`, ""}`, ""}

${validate_component(Header, "Header").$$render($$result, {}, {}, {})}

${validate_component(MainBlock, "MainBlock").$$render($$result, { wide: true }, {}, {
    default: () => {
      return `<h1>Spider</h1>
  <p>A \u201CSpider\u201D is a computer program. The Spider goes to different websites, explores, finds new things, and
    makes notes. When finished, it\u2019s notes are organised in to files describing everything it has seen.
  </p>
  <h1>Word Embedding</h1>
  <p>The next step is \u201CWord Embedding\u201D. A complicated topic! Word embedding creates a map, with coordinates,
    and puts each word on the map in it\u2019s own location. Artificial Intelligence research from written language
    translation websites is used. English words that have a similar meaning, are grouped in to close areas on
    the map. This is important! Similar ideas are in similar areas in the map.
  </p>
  <h1>Search</h1>
  <p>When you search for a word, your computer does this:
  </p>
  <ol><li>Download a map of all the signs the spider found, and what kind of meaning they have</li>
    <li>Look at the Word Embedding map, and find the word you searched for, remembering the location</li>
    <li>Check every sign, and see how close it\u2019s meaning is, to the word you entered, by how far away they are
    on the map</li>
    <li>Make a list, organised so the closest signs are at the top</li>
    <li>Download small videos and descriptions, and create the webpage, with results listed down the page</li></ol>
  <h1>Privacy and Tracking</h1>
  <p>We use a program called Fathom to see how many people use this website, and to find out what website they
    came from if they clicked a link to come here. When you do a search, we don\u2019t find out what words you typed
    in to the search box. We might be able to guess what kind of thing you were looking at, by seeing which search
    results your computer downloaded, but we don\u2019t know exactly what you wrote. We don\u2019t send your information to
    Google or Facebook at all, but if you come here using one of their apps like Google Chrome or Facebook App, they
    might be able to track you while you use their app.
  </p>
  <h1>Open Source and Dataset</h1>
  <p>Find Sign is open source (mostly with Unlicense software license). You can get the source code at
    <a href="${"https://github.com/Bluebie/sign-search"}">GitHub</a>.
  </p>
  <p>Find Sign indexes copyright data, so the dataset is not open source, but it is intended to be open access for
    non-commercial culturally appropriate use. For now, BitTorrent and Hypercore access has been disabled due to
    performance issues and barely any usage. Slow progress is being made refactoring the site to use simple yaml
    files to store all the interesting data. A service is planned to also offer JSON, XML, and CBOR translations
    of these YAML files. When this is finished, the data will be available over a simple http interface. For now,
    if you want access send me (@Bluebie on Github or Twitter) a message. Maybe we can sort something temporary out.
  </p>
  <p>If you want to apply this searching technology to another sign language, you&#39;ll need to capture the data for your
    search index, by building some kind of spider program. The easiest way to make this work is to output either YAML
    or JSON in the <a href="${"https://github.com/Bluebie/sign-search/blob/master/docs/search-data.md"}">search-data format</a>.
  </p>`;
    }
  })}`;
});
export { Technology as default, prerender };
