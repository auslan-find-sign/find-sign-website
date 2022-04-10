export const manifest = {
	appDir: "_app",
	assets: new Set([".DS_Store","robots.txt"]),
	mimeTypes: {".txt":"text/plain"},
	_: {
		entry: {"file":"start-22ecfb80.js","js":["start-22ecfb80.js","chunks/index-4d2c28a6.js","chunks/index-41dc71ea.js","chunks/singletons-d1fb5791.js"],"css":[]},
		nodes: [
			() => import('./nodes/0.js'),
			() => import('./nodes/1.js'),
			() => import('./nodes/3.js'),
			() => import('./nodes/2.js'),
			() => import('./nodes/4.js'),
			() => import('./nodes/5.js'),
			() => import('./nodes/6.js'),
			() => import('./nodes/8.js'),
			() => import('./nodes/9.js'),
			() => import('./nodes/7.js')
		],
		routes: [
			{
				type: 'page',
				id: "",
				pattern: /^\/$/,
				names: [],
				types: [],
				path: "/",
				shadow: null,
				a: [0,2],
				b: [1]
			},
			{
				type: 'page',
				id: "about",
				pattern: /^\/about\/?$/,
				names: [],
				types: [],
				path: "/about",
				shadow: () => import('./entries/endpoints/about.ts.js'),
				a: [0,3],
				b: [1]
			},
			{
				type: 'page',
				id: "loading-demo",
				pattern: /^\/loading-demo\/?$/,
				names: [],
				types: [],
				path: "/loading-demo",
				shadow: null,
				a: [0,4],
				b: [1]
			},
			{
				type: 'page',
				id: "random",
				pattern: /^\/random\/?$/,
				names: [],
				types: [],
				path: "/random",
				shadow: null,
				a: [0,5],
				b: [1]
			},
			{
				type: 'page',
				id: "search",
				pattern: /^\/search\/?$/,
				names: [],
				types: [],
				path: "/search",
				shadow: null,
				a: [0,6],
				b: [1]
			},
			{
				type: 'page',
				id: "technology",
				pattern: /^\/technology\/?$/,
				names: [],
				types: [],
				path: "/technology",
				shadow: null,
				a: [0,7],
				b: [1]
			},
			{
				type: 'page',
				id: "test-map-editor",
				pattern: /^\/test-map-editor\/?$/,
				names: [],
				types: [],
				path: "/test-map-editor",
				shadow: null,
				a: [0,8],
				b: [1]
			},
			{
				type: 'endpoint',
				id: "feeds/discovery.rss",
				pattern: /^\/feeds\/discovery\.rss$/,
				names: [],
				types: [],
				load: () => import('./entries/endpoints/feeds/discovery.rss.ts.js')
			},
			{
				type: 'endpoint',
				id: "feeds/discovery.json",
				pattern: /^\/feeds\/discovery\.json$/,
				names: [],
				types: [],
				load: () => import('./entries/endpoints/feeds/discovery.json.ts.js')
			},
			{
				type: 'endpoint',
				id: "feeds/discovery.atom",
				pattern: /^\/feeds\/discovery\.atom$/,
				names: [],
				types: [],
				load: () => import('./entries/endpoints/feeds/discovery.atom.ts.js')
			},
			{
				type: 'endpoint',
				id: "feeds/discovery-widget",
				pattern: /^\/feeds\/discovery-widget\/?$/,
				names: [],
				types: [],
				load: () => import('./entries/endpoints/feeds/discovery-widget.ts.js')
			},
			{
				type: 'page',
				id: "sign/[provider]/[id]",
				pattern: /^\/sign\/([^/]+?)\/([^/]+?)\/?$/,
				names: ["provider","id"],
				types: [null,null],
				path: null,
				shadow: () => import('./entries/endpoints/sign/_provider_/_id_.ts.js'),
				a: [0,9],
				b: [1]
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
};
