<script lang="ts" context="module">
  import type { EncodedSearchDataEntry } from '$lib/orthagonal/types'
  import { getSearchLibrary, search } from '$lib/search/search'

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

    return { props: {
      query,
      page,
      results,
      totalPages,
      viewport: url.searchParams.get('vp') === 'm' ? 'mobile' : 'desktop'
    } }
  }
</script>
<script lang="ts">
  import Header from '$lib/header/Header.svelte'
  import MainBlock from '$lib/MainBlock.svelte'
  import Paginator from '$lib/Paginator.svelte'
  import Result from '$lib/result/Result.svelte'
  import watchMedia from 'svelte-media'
  import { closest } from 'fastest-levenshtein'
  import { tokenize } from '$lib/search/text'
  import { browser } from '$app/env'
  import { fn } from '$lib/models/filename-codec'

	export let query: string = ''
  export let page: number = 0
  export let totalPages: number = 0
  export let results: EncodedSearchDataEntry[] = []
  export let viewport: 'mobile' | 'desktop' = 'desktop'

  let didYouMean = undefined
  $: (results.length === 0) && autocorrect(query)

  const media = watchMedia({ phone: '(max-width: 600px)' })
  $: if (browser) viewport = $media.phone ? 'mobile' : 'desktop'

  export let preconnectOrigin = [...new Set([
    import.meta.env.VITE_VECTOR_INDEX,
    import.meta.env.VITE_SEARCH_INDEX_PATH
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
</script>

<svelte:head>
	<title>“{query}” - Find Sign</title>
  {#each preconnectOrigin as origin}
  <link rel="preconnect" href={origin}>
  {/each}
</svelte:head>

<Header {query} showNavigation={false} />

{#if query === 'admin'}
  <div class="hint">Would you like to <a href="/admin">Login to Site Admin</a> area?</div>
{/if}

{#if results && results.length > 0}
  <div class="results">
    {#each results as entry, idx (`${entry.provider.id}/${entry.id}`)}
      <Result
        data={entry}
        key={idx}
        permalink={fn`/sign/${entry.provider.id}/${entry.id}`}
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
    toURL={(page) => `?query=${uri(query)}&page=${uri(page)}&vp=${viewport === 'mobile' ? 'm' : 'd'}`}
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
</style>