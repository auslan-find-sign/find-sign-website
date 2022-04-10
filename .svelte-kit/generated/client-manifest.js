export { matchers } from './client-matchers.js';

export const components = [
	() => import("../../src/routes/__layout.svelte"),
	() => import("../runtime/components/error.svelte"),
	() => import("../../src/routes/about.svelte"),
	() => import("../../src/routes/index.svelte"),
	() => import("../../src/routes/loading-demo.svelte"),
	() => import("../../src/routes/random.svelte"),
	() => import("../../src/routes/search.svelte"),
	() => import("../../src/routes/sign/[provider]/[id].svelte"),
	() => import("../../src/routes/technology.svelte"),
	() => import("../../src/routes/test-map-editor.svelte")
];

export const dictionary = {
	"": [[0, 3], [1]],
	"about": [[0, 2], [1], 1],
	"loading-demo": [[0, 4], [1]],
	"random": [[0, 5], [1]],
	"search": [[0, 6], [1]],
	"technology": [[0, 8], [1]],
	"test-map-editor": [[0, 9], [1]],
	"sign/[provider]/[id]": [[0, 7], [1], 1]
};