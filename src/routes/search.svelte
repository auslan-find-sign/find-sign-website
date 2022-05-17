<script lang="ts" context="module">
  import type { SearchDataItem } from '$lib/search/search-index'
  import { search } from '$lib/search/search'

  const resultsPerPage = 10
  const maxPages = 9

  const uri = encodeURIComponent

	/** @type {import('./search').Load} */
  export async function load ({ url }) {
    const query = url.searchParams.get('query') || ''
    const page = parseInt(url.searchParams.get('page') || '0')

    // empty queries go home!
    if (query.trim() === '') return { status: 301, redirect: '/' }

    const { results, totalResults } = await search(query, page * resultsPerPage, resultsPerPage)
    const totalPages = Math.min(maxPages, Math.ceil(totalResults / resultsPerPage))

    return { props: { query, page, results, totalPages } }
  }
</script>
<script lang="ts">
  import Header from '$lib/header/Header.svelte'
  import MainBlock from '$lib/MainBlock.svelte'
  import Paginator from '$lib/Paginator.svelte'
  import ResultTile from '$lib/ResultTile.svelte'

	export let query: string = ''
  export let page: number = 0
  export let totalPages: number = 0
  export let results: SearchDataItem[] = []
  console.log(results)
</script>

<svelte:head>
	<title>“{query}” - Find Sign</title>
</svelte:head>

<Header {query} showNavigation={false} />

{#if query === 'admin'}
  <div class="hint">Would you like to <a href="/admin">Login to Site Admin</a> area?</div>
{/if}

{#if results && results.length > 0}
  <div class="results">
    {#each results as entry, idx (`${entry.provider}/${entry.id}`)}
      <ResultTile data={entry} key={idx} permalink="/sign/{uri(entry.provider)}/{uri(entry.id)}" />
    {/each}
  </div>
{:else}
  <MainBlock>
    <h1>No results found</h1>
  </MainBlock>
{/if}

{#if totalPages > 0}
  <Paginator selected={page} length={totalPages} toURL={(page) => `?query=${uri(query)}&page=${uri(page)}`}/>
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

  .hint {
    margin-top: 1em;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    font-style: italic;
  }
</style>