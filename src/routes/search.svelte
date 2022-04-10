<script context="module">
  import { browser } from '$app/env'
  import * as searchIndex from '$lib/search/search-index'
  import * as precomputedVectors from '$lib/search/precomputed-vectors'
  import rank from '$lib/search/search-rank'
  import { compileQuery } from '$lib/search/text'
  import siteConfig from '$lib/site-config.json'

  const resultsPerPage = 10
  const maxPages = 9

	/** @type {import('./search').Load} */
  export async function load ({ url, fetch }) {
    const query = url.searchParams.get('query') || ''
    const page = parseInt(url.searchParams.get('page') || '0')
    const serverRender = url.searchParams.get('ssrplz') === 'yes'
    let results = []
    let totalPages = 0
    let searchLibrary = undefined

    // empty queries go home!
    if (query.trim() === '') return { status: 301, redirect: '/' }

    if (browser || serverRender) {
      searchLibrary = await searchIndex.open(siteConfig.searchIndex)
      const vectors = await precomputedVectors.open(siteConfig.vectorIndex, (...args) => fetch(...args))
      const queryFn = await compileQuery(query, (word) => precomputedVectors.lookup(vectors, word))
      console.log('queryFn', queryFn)
      const ranked = rank(searchLibrary, queryFn)
      results = ranked.index.slice(page * resultsPerPage, (page * resultsPerPage) + resultsPerPage)
      totalPages = Math.min(maxPages, Math.ceil(ranked.index.length / resultsPerPage))
    }

    return { props: { query, page, results, totalPages, library: searchLibrary } }
  }
</script>

<script lang="ts">
  import Header from '$lib/header/Header.svelte'
  import Paginator from '$lib/Paginator.svelte'
  import ResultTile from '$lib/ResultTile.svelte'
  import Spinner from '$lib/Spinner.svelte'

  export let library
	export let query = ''
  export let page = 0
  export let totalPages = 0
  export let results = []
</script>

<svelte:head>
	<title>“{query}” - Find Sign</title>
</svelte:head>

<Header {query} showNavigation={false} />

{#if results}
  <div class="results">
    {#each results as entry}
      {#await searchIndex.getResult(library, entry)}
        <ResultTile/>
      {:then data}
        <ResultTile {data} permalink="/sign/{data.provider}/{data.id}"/>
      {/await}
    {/each}
  </div>
{:else}
  <Spinner class="spinner" active={true} />
{/if}

{#if totalPages > 0}
  <Paginator selected={page} length={totalPages} toURL={(page) => `?${new URLSearchParams(Object.entries({ query, page }))}`}/>
{/if}

<style>
  .results {
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
  }

  :global(.spinner) {
    margin-left: auto;
    margin-right: auto;
  }
</style>