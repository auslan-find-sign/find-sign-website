import { c as create_ssr_component, v as validate_component, b as add_attribute, o as each, e as escape } from "../../chunks/index-221b5e23.js";
import { H as Header } from "../../chunks/Header-42cee668.js";
import { M as MainBlock } from "../../chunks/MainBlock-a88c016a.js";
var about_svelte_svelte_type_style_lang = "";
const css = {
  code: '*{box-sizing:border-box}body{font-family:"Helvetica Neue", Helvetica, Arial, sans-serif;background-color:var(--base-bg);color:var(--base-fg)}ul.hashtags.svelte-azii6d>li.svelte-azii6d>span.svelte-azii6d{opacity:0.5;font-size:70%}h1.svelte-azii6d.svelte-azii6d.svelte-azii6d{font-weight:200;font-style:italic;text-align:center}h1.svelte-azii6d.svelte-azii6d.svelte-azii6d::before{content:"\u2014\u276E\u276C   "}h1.svelte-azii6d.svelte-azii6d.svelte-azii6d::after{content:"   \u276D\u276F\u2014"}h1.svelte-azii6d.svelte-azii6d.svelte-azii6d::before,h1.svelte-azii6d.svelte-azii6d.svelte-azii6d::after{font-style:normal;opacity:0.5}',
  map: null
};
function searchURL(query) {
  return `/search?${new URLSearchParams(Object.entries({ query, page: 0 }))}`;
}
const About = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { hashtags = [] } = $$props;
  if ($$props.hashtags === void 0 && $$bindings.hashtags && hashtags !== void 0)
    $$bindings.hashtags(hashtags);
  $$result.css.add(css);
  return `${$$result.head += `${$$result.title = `<title>Find Sign - About</title>`, ""}`, ""}



${validate_component(Header, "Header").$$render($$result, {}, {}, {})}

${validate_component(MainBlock, "MainBlock").$$render($$result, { wide: true }, {}, {
    default: () => {
      return `<h1 class="${"svelte-azii6d"}">What is this?</h1>
  <p>This website is a search engine. It looks at other websites that have Auslan sign videos, and creates
    search results including videos from other websites. This search system uses Artificial Intelligence
    research to understand what words and signs mean, and find signs with similar meaning.
  </p>
  <p>Try any English word or phrase. This website will try to understand what the word means, and find sign
    videos with similar meaning. It&#39;s different to how other Auslan search systems work. You don\u2019t need
    to type the same words the authors of sign videos used in their English descriptions. If the meaning is
    similar, it should find it!
  </p>
  <h1 class="${"svelte-azii6d"}">Who is this for?</h1>
  <p>I think it\u2019s useful for two people:
  </p>
  <ol><li>Person learning Auslan: they can learn more vocabulary</li>
    <li>Person who doesn\u2019t know much English: They can look up an English word, and see roughly what
      it might mean in Auslan, even if no sign for exactly that idea exists in the websites yet</li></ol>
  <h1 class="${"svelte-azii6d"}">Who made it?</h1>
  <p>My name is Phoenix. I\u2019m Hard of Hearing, and I love Auslan! English is my first language, but Auslan
    is my favourite language. I created Find Sign to help make it easier for people learning this beautiful
    language, and launched this website in 2019, after 6 months building it together with input from many
    Deaf friends and Auslan students.
  </p>
  <p>I want to help spread Auslan to people who cannot learn it. Maybe they are too poor to come to Deaf
    socials or go to Tafe, or maybe they live far away and cannot travel. I think a lot of people can live
    better lives by learning some Auslan, and there are lots of ways to help spread information and grow
    our community! Even if they only learn vocabulary and use signed english style, it can still help
    improve their life!
  </p>
  <h1 class="${"svelte-azii6d"}">How to use it best?</h1>
  <p>The simplest thing is to type some words in to the search box, and see signs from all around Australia.
    But Find Sign can do some more advanced searches:
  </p>
  <p>#hashtags allow you to limit the search results, so only results with the tags you asked for appear.
    Every search result has a list of #hashtags under the web link. You can put any of these in to the
    search box, and then your results will only be ones which include every hashtag you searched for.
    For example, you can search for &quot;<a${add_attribute("href", searchURL("#asphyxia"), 0)}>#asphyxia</a>&quot; to only see results
    from Asphyxia&#39;s youtube series, or &quot;<a${add_attribute("href", searchURL("#qld"), 0)}>#qld</a>&quot; to only see results which
    are listed as being used in Queensland. You can also search for a hashtag, with a minus in front of
    it, like &quot;<a${add_attribute("href", searchURL("-#toddslan"), 0)}>-#toddslan</a>&quot; to show results which <em>do not include</em>
    #toddslan. This can be very powerful with Auslan Signbank searches. You can search for
    &quot;<a${add_attribute("href", searchURL("#signbank #phonology.symmetrical"), 0)}>#signbank #phonology.symmetrical</a>&quot; to find
    results where both hands do the same thing.
  </p>
  <h1 class="${"svelte-azii6d"}">What are all the #hashtags?</h1>
  <ul class="${"hashtags svelte-azii6d"}">${each(hashtags, ({ hashtag, count }) => {
        return `${count > 1 ? `<li class="${"svelte-azii6d"}"><a${add_attribute("href", searchURL(`#${hashtag}`), 0)}>#${escape(hashtag)}</a> <span class="${"svelte-azii6d"}">(${escape(count)})</span></li>` : ``}`;
      })}</ul>`;
    }
  })}`;
});
export { About as default };
