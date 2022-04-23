<script lang="ts" context="module">
  import { getSearchLibrary } from '$lib/search/search'
  import { getResultByPath, type SearchDataItem } from '$lib/search/search-index'

  export async function load ({ params }) {
    const library = await getSearchLibrary()
    const result = await getResultByPath(library, decodeURIComponent(params.provider), decodeURIComponent(params.id))
    return { props: { result } }
  }
</script>
<script lang="ts">
  import Header from '$lib/header/Header.svelte'
  import ResultTile from '$lib/ResultTile.svelte'
  import { page } from '$app/stores'

  export let result: SearchDataItem

  $: selectedVideoOffset = parseInt($page.url.searchParams.get('carousel0') || '0')

  const ogVideoTypePreference = ['video/mp4', 'video/webm']
  $: openGraphVideos = result.media.map((formats) => {
    return formats.sort((a, b) => ogVideoTypePreference.indexOf(a.type) - ogVideoTypePreference.indexOf(b.type))[0]
  }).slice(selectedVideoOffset, selectedVideoOffset + 1)
</script>
<svelte:head>
	<title>{result.provider}’s “{result.title || result.keywords.join(' ')}”</title>
  <meta property="og:title" content="Auslan: “{result.title || result.keywords.join(' ')}”">
  <meta property="og:type" content="video">
  <meta property="og:description" content="{result.body}">
  {#each openGraphVideos as video}
    <meta property="og:video" content="{video.src}">
    <meta property="og:video:type" content="{video.type}">
    <meta property="og:video:width" content="{video.maxWidth.toString()}">
    <meta property="og:video:height" content="{video.maxHeight.toString()}">
  {/each}
</svelte:head>


<Header />

<div>
  <ResultTile key={0} data={result} expand />
</div>

<style>
  div {
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 50vh;
  }
</style>