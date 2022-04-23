<script context="module">
  import { browser } from '$app/env'
  import * as searchIndex from '$lib/search/search-index'
  import * as precomputedVectors from '$lib/search/precomputed-vectors'
  import rank from '$lib/search/search-rank'
  import { compileQuery, normalizeWord } from '$lib/search/text'
  import siteConfig from '$lib/site-config.json'
  import uri from 'uri-tag'

  const resultsPerPage = 10
  const maxPages = 9

	/** @type {import('./search').Load} */
  export async function load ({ url, fetch }) {
    const query = url.searchParams.get('query') || ''
    const page = parseInt(url.searchParams.get('page') || '0')
    const serverRender = url.searchParams.get('ssr') === 'yes'
    let results = []
    let totalPages = 0
    let searchLibrary = undefined

    // empty queries go home!
    if (query.trim() === '') return { status: 301, redirect: '/' }

    if (browser || serverRender) {
      searchLibrary = await searchIndex.open(siteConfig.searchIndex)
      const vectors = await precomputedVectors.open(siteConfig.vectorIndex)
      const queryFn = await compileQuery(query, async (word) => {
        const normalized = normalizeWord(word)
        const normalizedResult = await precomputedVectors.lookup(vectors, normalized)
        if (normalizedResult) {
          return normalizedResult
        } else if (normalized !== normalized.toLowerCase()) {
          const lowerCasedResult = await precomputedVectors.lookup(vectors, normalized.toLowerCase())
          return lowerCasedResult
        }
      })

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

  export let library: searchIndex.Library
	export let query: string = ''
  export let page: number = 0
  export let totalPages: number = 0
  export let results: searchIndex.LibraryEntry[] = []
</script>

<svelte:head>
	<title>“{query}” - Find Sign</title>
</svelte:head>

<Header {query} showNavigation={false} />

{#if results}
  <div class="results">
    {#each results as entry, idx}
      {#await searchIndex.getResult(library, entry)}
        <ResultTile key={idx} />
      {:then data}
        <ResultTile {data} key={idx} permalink={uri`/sign/${data.provider}/${data.id}`} />
      {/await}
    {/each}
  </div>
{:else}
  <Spinner class="spinner" active={true} />
{/if}

{#if totalPages > 0}
  <Paginator selected={page} length={totalPages} toURL={(page) => uri`?query=${query}&page=${page}`}/>
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