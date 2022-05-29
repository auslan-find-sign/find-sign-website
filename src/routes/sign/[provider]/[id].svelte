<script lang="ts" context="module">
  import { getSearchLibrary } from '$lib/search/search'
  import { decodeFilename } from '$lib/models/filename-codec'

  export async function load ({ params }) {
    const provider = decodeFilename(params.provider)
    const id = decodeFilename(params.id)
    const library = await getSearchLibrary([provider], ['id'])
    const result = await library[provider].entries.find(x => x.id === id).load()
    return { props: { result } }
  }
</script>
<script lang="ts">
  import Header from '$lib/header/Header.svelte'
  import ResultTile from '$lib/ResultTile.svelte'
  import { page } from '$app/stores'
  import type { EncodedSearchDataEntry } from '$lib/orthagonal/types'

  export let result: EncodedSearchDataEntry

  $: selectedVideoOffset = parseInt($page.url.searchParams.get('carousel0') || '0')

  const ogVideoTypePreference = ['video/mp4', 'video/webm']
  $: openGraphVideos = result.media.map((formats) => {
    return formats.encodes.sort((a, b) => ogVideoTypePreference.indexOf(a.type) - ogVideoTypePreference.indexOf(b.type))[0]
  }).slice(selectedVideoOffset, selectedVideoOffset + 1)
</script>
<svelte:head>
	<title>{result.provider.name || result.provider.id}’s “{result.title || result.words.join(' ')}”</title>
  <meta property="og:title" content="Auslan: “{result.title || result.words.join(' ')}”">
  <meta property="og:type" content="video">
  <meta property="og:description" content="{result.body}">
  {#each openGraphVideos as video}
    <meta property="og:video" content="{video.url}">
    <meta property="og:video:type" content="{video.type}">
    <meta property="og:video:width" content="{video.width.toString()}">
    <meta property="og:video:height" content="{video.height.toString()}">
  {/each}
</svelte:head>


<Header />

<div>
  <ResultTile key={0} data={result} expand prefer="quality" />
</div>

<style>
  div {
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 50vh;
  }
</style>