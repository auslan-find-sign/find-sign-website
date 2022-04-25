<script lang="ts" context="module">
  import type { SearchDataItem } from '$lib/search/search-index'
  import { getSearchLibrary } from '$lib/search/search'
  import { getResultByPath, getProviderIDForLibraryEntry } from '$lib/search/search-index'

  const blockedTags = [
    'signpedia', // block signpedia-like entries, not established signs
    'invented', // block toddslan-like entries
    'lexis.crude', // block rude signbank stuff, want relatively unshocking kid friendly results
    'semantic.sexuality' // block formal register sexual body parts type of words
  ]

  async function getRandomSigns (count: number): Promise<[provider: string, entry: string][]> {
    const library = await getSearchLibrary()
    const signs = []

    for (let i = 0; i < 100 * count; i++) {
      const random = library.index[Math.round(Math.random() * (library.index.length - 1))]
      const tagMatch = blockedTags.some(x => random.tags.includes(x))
      if (!tagMatch) {
        // load the result and set it up as the answer
        signs.push(await getProviderIDForLibraryEntry(library, random))
        if (signs.length >= count) return signs
      }
    }
  }

  import type { Load } from './random'
  export const load: Load = async function load ({ url }) {
    const sign = url.searchParams.get('sign')
    if (sign) {
      const [provider, entry] = sign.split('*')
      const library = await getSearchLibrary()
      const result = await getResultByPath(library, provider, entry)
      const [random] = await getRandomSigns(1)
      const next = `/random?${new URLSearchParams([['sign', random.join('*')]])}`
      return { props: { result, next } }
    } else {
      const library = await getSearchLibrary()
      const [random1, random2] = await getRandomSigns(2)
      const result = await getResultByPath(library, ...random1)
      const next = `/random?${new URLSearchParams([['sign', random2.join('*')]])}`
      return { props: { result, next } }
    }
  }
</script>
<script lang="ts">
  import Header from '$lib/header/Header.svelte'
  import ResultTile from '$lib/ResultTile.svelte'
  import { onMount } from 'svelte'
import { prefetch } from '$app/navigation'

  export let result: SearchDataItem | undefined
  export let next: string // next url

  onMount(() => {
    prefetch(next)
  })
</script>

<svelte:head>
  <title>Random Sign</title>
</svelte:head>

<Header/>

<main>
  <h1>Random Sign Generator</h1>

  <h2><a href={next} role="button" class="button" sveltekit:noscroll>🎲 Reroll</a></h2>
  <div class="result-box">
    <ResultTile data={result} expand/>
  </div>
  <div style="height: 20em"></div>
</main>

<style>
  :global(*) {
    box-sizing: border-box; /* i just like it better ok? microsoft was right */
  }

  :global(body) {
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    background-color: var(--base-bg);
    color: var(--base-fg);
  }

  h2 .button {
    --button-hue: calc(var(--hue) - 45deg);
    width: 100%;
    display: block;
    background-color: hsl(var(--button-hue), var(--module-bg-sat), var(--module-bg-lum));
    color: hsl(var(--button-hue), var(--base-fg-sat), var(--base-fg-lum));
    appearance: none;
    padding: 1ex 1em;
    border-radius: calc((1em + 2ex) / 2);
    line-height: 1;
    border: 0 none;
    font-size: inherit;
    font-weight: inherit;
  }

  h2 .button:hover {
    background-color: hsl(var(--button-hue), var(--submodule-bg-sat), var(--submodule-bg-lum));
    cursor: pointer;
  }

  /* .spacer {
    height: 200vh;
  } */
</style>