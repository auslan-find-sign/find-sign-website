<script lang="ts" context="module">
  import type { SearchDataItem } from '$lib/search/search-index'
  import { getSearchLibrary } from '$lib/search/search'
  import { getResultByPath } from '$lib/search/search-index'
  import { getRandomSigns } from '$lib/search/random'

  import type { Load } from './random'
  export const load: Load = async function load ({ url }) {
    const sign = url.searchParams.get('sign')
    let randoms = await getRandomSigns(2)

    if (sign) {
      const [provider, id] = sign.split('*')
      randoms[0] = { provider, id }
    }
    const library = await getSearchLibrary([randoms[0].provider], ['id'])
    const result = await library[randoms[0].provider].entries.find(x => x.id === randoms[0].id).load()
    const next = `/random?${new URLSearchParams([['sign', `${randoms[1].provider}*${randoms[1].id}`]])}`
    const permalink = `/sign/${encodeURIComponent(randoms[0].provider)}/${encodeURIComponent(randoms[0].id)}`
    return { props: { result, permalink, next } }
  }
</script>
<script lang="ts">
  import Header from '$lib/header/Header.svelte'
  import ResultTile from '$lib/ResultTile.svelte'
  import { onMount } from 'svelte'
  import { prefetch } from '$app/navigation'
  import type { EncodedSearchDataEntry } from '$lib/orthagonal/types'

  export let result: EncodedSearchDataEntry
  export let permalink: string
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
    {#key permalink}
      <ResultTile data={result} {permalink} expand prefer="quality" carouselSelected={0} />
    {/key}
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
</style>