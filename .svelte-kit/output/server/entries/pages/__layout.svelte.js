import { g as getContext, c as create_ssr_component, a as subscribe, b as add_attribute, v as validate_component } from "../../chunks/index-221b5e23.js";
import { H as Header } from "../../chunks/Header-42cee668.js";
import { S as Spinner } from "../../chunks/Spinner-3f422681.js";
/* empty css                                                           */const getStores = () => {
  const stores = getContext("__svelte__");
  return {
    page: {
      subscribe: stores.page.subscribe
    },
    navigating: {
      subscribe: stores.navigating.subscribe
    },
    get preloading() {
      console.error("stores.preloading is deprecated; use stores.navigating instead");
      return {
        subscribe: stores.navigating.subscribe
      };
    },
    session: stores.session,
    updated: stores.updated
  };
};
const navigating = {
  subscribe(fn) {
    const store = getStores().navigating;
    return store.subscribe(fn);
  }
};
var favicon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFT0lEQVR4AaVXBZArNwy9X2ZmHiozczv0mf8/jL13lzIOl5mZmWngMzMzM2ezyTEzh1a1FJ3HmW0ze21mFLIlPcGTvTn4gtdeOyznf7wAcgbRp2MFwZF/gSMm9P/vQzntHMLFN4Et/oSwfJh+55CyD/3cw+kzIkdB84MADQ8A1AUBQsX30v+TaT37C6IlpyjH9dD6EECLEkeON4xn111x/xHpAOSvUK+c27KDQNjyibQNWs/+gjLrBohaoIx0Q30QP7/l7BzhuwyO3AzVpagbg9ogB0EAfQAIl16oFLqUsgs1aEQs1eXJmn4YxNGfpfRbOIgUlBUDhORt/kuwL/cEpViFiiRhWQ6VucdmbySj/uHAXVBOeimIWIDBYFA6CH8pFDugqoSMKElCRFzWbwBBeJvSqL8jH8W6U/oryEaZGYA/FjhiEXWvzTWMFI/m7BzlSbmKHPuD17AE30MjAejjEq715dxMI/KXo+glY7Z8Re85VHgGGyMQ3h6yNpBjBIA2HOtPvyzSna5QfwaNBoCI9Wc055JT3H2BKcpghwK0CdoeOxX3JvcWjlJO34ZQ0fVwMHii0mnl3omlwVuvadu+AdjydQYQw15wDwQOdC8YsxfaHwZiR+cjkNpb9GzXrNF/QtODAB0PgxuWNUovFyLU/SgJqKcySt0j/gGIF9LoRULRyYVdhRBfOA5ZEQcbqWVBbO3EmsSaiQDlluvaMqn29sCBwBK1hnV3SSqKsQR3/4cSyBc1ABVRak+h2zV9dAociRGR08S6XAUiF8G4GLEbEqnUnqIk7kHnnIleNVkvMRrcdw98gABcBOAo4wcFdE4diU4ovVjjvpUT3BhmACNGAIcEJHcWAgFA+lbwDKl5+LiBH0Y201DNAK4ndCkAqX1F6ICc9i4bj2XQABBkfHM+ppz0kAnIiAzn/B0nIvYEiodJNEqxk6NcS1sCprNr+ihI7Cig7wRg8TiIqTKYAGLrcwkglo4Po8m6/lkaMaM8Suk+qNRTEI2Qk+45YyC+IQ8QGP7uWTDWA6Bv1QQCQKVrpBnwcdrmU0dTFtgZ2IHblc5DSkpwrmSAwAUeQgkNQM323iXjoHf5BHRIILrnjaGITQC9S8f390A8DUA8mxFpSJQqewfQHpaYKOzIWgjJK8xJ9oZmgJEB1fHQPXcMOifBjMQ2mAAC0LNwLH1HXQ7iVw7qamVnIf1HZ4xw2X5HeraIH00AX3oARC2qf+eUkdgDJGoIUUk0gAMBygo3LdKQzhI8C3Cg8d0iwRLHPZQFbFZb5JlN+AMhZQBabAHtfwyDJDZibSllI76JeoLWU/sClBUsgQbhSHKAn4ZzQPs8L+ZDRNyTwRS18JWZATMLyPu2H4cQBdt+HgKJLfnUH7iW3F1EWSFAtgGCqCzwM0EnKwGzfsGz459ZEBaZPcDCdMSoKdLu2aOhc/JISj2u4aDqoyY1AehMpLgES7AftC+cB0xRE4DFm00AZiYwapqGPYvGQfuvQ6H9t6EEiPZ4JcXH85vmxP3X6xkiNNF7QWhBMFh7PBnpu3cvn4iO+FjPAB+HEoLYxrfapDcib1lIbG/kfDesgK0PH6lr7eteb1tBGhJIHzaYVbzOSZcHzaNkk0H4frSihmkmEH26FP6ljwfRCt8noedEbKTr1WZ8OmIaxambszl2qGQxvgtGwS49c0DXcZMeulsd8TU1GBqlux6BSBBNWZgxLh1izZT2jbBfnOvzJpQdhH5cs61flJM6coJgGrXQb2bBfiVPk5J/59n7wTQCTu7JKuL78WFTRfmO+vxUOXyLTlBH3qwf7Qeednr9DZTel+Nd9BYHAAAAAElFTkSuQmCC";
var app = "";
const prerender = true;
const _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let loading;
  let $navigating, $$unsubscribe_navigating;
  $$unsubscribe_navigating = subscribe(navigating, (value) => $navigating = value);
  loading = $navigating !== null;
  $$unsubscribe_navigating();
  return `${$$result.head += `<link rel="${"icon"}" type="${"image/png"}" sizes="${"32x32"}"${add_attribute("href", favicon, 0)} data-svelte="svelte-f9k7d4"><meta name="${"viewport"}" content="${"width=device-width"}" data-svelte="svelte-f9k7d4">`, ""}

${!loading ? `${slots.default ? slots.default({}) : ``}` : `${validate_component(Header, "Header").$$render($$result, { showNavigation: true }, {}, {})}
	${validate_component(Spinner, "Spinner").$$render($$result, { active: true }, {}, {})}`}`;
});
export { _layout as default, prerender };
