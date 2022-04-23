<script lang="ts" context="module">
  import type { SearchDataItem } from '$lib/search/search-index'
  import { getSearchLibrary } from '$lib/search/search'
  import { getResult } from '$lib/search/search-index'
  import { browser } from '$app/env'

  const blockedTags = [
    'signpedia', // block signpedia-like entries, not established signs
    'invented', // block toddslan-like entries
    'lexis.crude', // block rude signbank stuff, want relatively unshocking kid friendly results
    'semantic.sexuality' // block formal register sexual body parts type of words
  ]

  import type { Load } from './random'
  export const load: Load = async function load ({ stuff }) {
    if (browser) {
      const library = await getSearchLibrary()
      for (let i = 0; i < 100; i++) {
        const random = library.index[Math.round(Math.random() * (library.index.length - 1))]
        const tagMatch = blockedTags.some(x => random.tags.includes(x))
        if (!tagMatch) {
          // load the result and set it up as the answer
          return {
            props: {
              loading: false,
              result: await getResult(library, random),
              error: undefined
            }
          }
        }
      }
      return { props: { loading: false, result: undefined, error: 'failed to find a suitable result' } }
    } else {
      return { props: { loading: true, result: undefined, error: undefined } }
    }
  }
</script>
<svelte:head>
  <title>Random Sign</title>
</svelte:head>
<script lang="ts">
  // import siteConfig from '$lib/site-config.json'
  import Header from '$lib/header/Header.svelte'
  import ResultTile from '$lib/ResultTile.svelte'
  import Spinner from '$lib/Spinner.svelte'
  // import { onMount } from 'svelte'
  // import { open, freshen, getResult } from '$lib/search/search-index'
  import { fade } from 'svelte/transition'
import { invalidate } from '$app/navigation';

  export let result: SearchDataItem | undefined
  export let loading: boolean
  export let error: string | undefined

  // async function reroll () {
  //   // clear current result
  //   result = undefined
  //   library = await freshen(library)
  //   const random = Object.create(library.index[Math.round(Math.random() * (library.index.length - 1))])
  //   const tagMatch = blockedTags.some(x => random.tags.includes(x))
  //   if (!tagMatch) {
  //     // load the result and set it up as the answer
  //     result = await getResult(library, random)
  //   } else {
  //     reroll()
  //   }
  // }

  function reroll () {
    invalidate('/random')
  }

  // onMount(async () => {
  //   library = await open(siteConfig.searchIndex)
  //   reroll()
  // })
</script>

<Header/>

<main>
  <h1>Random Sign Generator</h1>

  <h2><button disabled={loading} on:click={reroll}>🎲 Reroll</button></h2>

  {#if result}
    <div class="result-box" transition:fade={{ duration: 100 }}>
      <ResultTile bind:data={result} expand/>
    </div>
  {:else if loading}
    <div class=spacer>
      <Spinner/>
    </div>
  {:else if error}
    <h1>{error}</h1>
  {/if}

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

  h2 button {
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

  h2 button:enabled:hover {
    background-color: hsl(var(--button-hue), var(--submodule-bg-sat), var(--submodule-bg-lum));
    cursor: pointer;
  }

  .spacer {
    height: 200vh;
  }
</style>