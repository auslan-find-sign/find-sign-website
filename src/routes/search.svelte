<script lang="ts" context="module">
  import { getSearchLibrary, search, type SearchResult } from '$lib/search/search'

  const resultsPerPage = 10
  const maxPages = 9

  const uri = encodeURIComponent

	/** @type {import('./search').Load} */
  export async function load ({ url }) {
    const query = url.searchParams.get('query') || ''
    const page = parseInt(url.searchParams.get('page') || '0')
    const region = url.searchParams.get('r')

    // empty queries go home!
    if (query.trim() === '') return { status: 301, redirect: '/' }

    let actualQuery = region ? `#${region} (${query})` : query
    const { results, totalResults } = await search(actualQuery, page * resultsPerPage, resultsPerPage)
    const totalPages = Math.min(maxPages, Math.ceil(totalResults / resultsPerPage))

    return { props: {
      query,
      page,
      results,
      totalPages,
      region: region || false,
      viewport: url.searchParams.get('vp') === 'm' ? 'mobile' : 'desktop'
    } }
  }
</script>
<script lang="ts">
  import { page as pageStore } from '$app/stores'
  import regionStore from '$lib/models/region-store'

  import Header from '$lib/header/Header.svelte'
  import MainBlock from '$lib/MainBlock.svelte'
  import Paginator from '$lib/Paginator.svelte'
  import Result from '$lib/result/Result.svelte'
  import watchMedia from 'svelte-media'
  import { closest } from 'fastest-levenshtein'
  import { tokenize } from '$lib/search/text'
  import { browser } from '$app/env'
  import { fn } from '$lib/models/filename-codec'
  import { goto } from '$app/navigation';

	export let query: string = ''
  export let page: number = 0
  export let totalPages: number = 0
  export let results: SearchResult[] = []
  export let viewport: 'mobile' | 'desktop' = 'desktop'
  export let region

  let didYouMean = undefined
  $: (results.length === 0) && autocorrect(query)

  const media = watchMedia({ phone: '(max-width: 600px)' })
  $: if (browser) viewport = $media.phone ? 'mobile' : 'desktop'

  export let preconnectOrigin = [...new Set([
    import.meta.env.VITE_VECTOR_INDEX,
    import.meta.env.VITE_SEARCH_DATA
  ].map(x => (new URL(x)).origin))]

  // attempt to offer autocorrection
  async function autocorrect(query) {
    didYouMean = undefined
    const lib = await getSearchLibrary(false, ['words'])
    const words: Set<string> = new Set()
    for (const provider of Object.values(lib)) {
      for (const entry of provider.entries) {
        if (entry.words) entry.words.forEach(word => words.add(word.toLowerCase()))
      }
    }

    const knownWords = [...words]

    const terms = tokenize(query)
    const suggestion = []
    for (const term of terms) {
      if (term.match(/^[a-z0-9_-]+$/)) {
        const nearest = closest(term, knownWords)
        suggestion.push(nearest)
      } else {
        suggestion.push(term)
      }
    }

    if (suggestion.join(' ') !== terms.join(' ')) {
      didYouMean = suggestion.join(' ')
      console.log(didYouMean)
    }
  }

  function regionChangeHandler (event) {
    console.log(event)
    if (event.detail.region !== region) {
      const searchParams = new URLSearchParams($pageStore.url.searchParams)
      if (event.detail.region) {
        searchParams.set('r', event.detail.region)
      } else {
        searchParams.delete('r')
      }
      goto(`?${searchParams}`, { noscroll: true, replaceState: true })
    }
  }
</script>

<svelte:head>
	<title>“{query}” - Farts Sign</title>
  {#each preconnectOrigin as origin}
  <link rel="preconnect" href={origin}>
  {/each}
</svelte:head>

<Header {query} showNavigation={false} on:regionChange={regionChangeHandler} />

{#if query === 'admin'}
  <div class="hint">Would you like to <a href="/admin">Login to Site Admin</a> area?</div>
{/if}

{#if region}
  {@const everythingURL = (() => {
    const p = new URLSearchParams($pageStore.url.searchParams)
    p.delete('r')
    return `?${p}`
  })()}
  <div class="hint">Only showing results in {`${region}`.toUpperCase()}, would you like to <a href="{everythingURL}">see everything</a>?</div>
{/if}
{#if $regionStore && $regionStore !== region}
  {@const limitURL = (() => {
    const p = new URLSearchParams($pageStore.url.searchParams)
    p.set('r', `${$regionStore}`)
    return `?${p}`
  })()}
  <div class="hint">Showing results in every region, would you like to <a href="{limitURL}">limit to only {`${$regionStore}`.toUpperCase()}</a>?</div>
{/if}

{#if results && results.length > 0}
  <div class="results">
    {#each results as entry, idx (`${entry.provider.id}/${entry.id}`)}
      <Result
        data={entry}
        key={idx}
        permalink={fn`/sign/${entry.index || entry.provider.id}/${entry.id}`}
        prefer={viewport === 'desktop' ? 'performance' : 'quality'} />
    {/each}
  </div>
{:else}
  <MainBlock>
    <h1>No results found</h1>
    {#if didYouMean}
      <p>Did you mean: <a href="?query={encodeURIComponent(didYouMean)}&page=0">{didYouMean}</a>?</p>
    {:else}
      <p>This could be because of a misspelled word</p>
    {/if}
  </MainBlock>
{/if}

{#if totalPages > 0}
  <Paginator
    selected={page}
    length={totalPages}
    toURL={(page) => {
      return `?${new URLSearchParams([
        ['query', query],
        ['page', `${page}`],
        ['vp', viewport === 'mobile' ? 'm' : 'd']
      ])}`
    }}
    />
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
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    font-style: italic;
  }

  .hint a {
    display: inline-block; /* try not to break over multiple lines if possible */
  }
</style>