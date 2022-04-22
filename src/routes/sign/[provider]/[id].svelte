<script lang="ts" context="module">
  import siteConfig from '$lib/site-config.json'
  import { open, getResultByPath } from '$lib/search/search-index'

  export async function load ({ params }) {
    const library = await open(siteConfig.searchIndex)
    const result = await getResultByPath(library, decodeURIComponent(params.provider), decodeURIComponent(params.id))
    return { props: { result } }
  }
</script>
<script lang="ts">
  import Header from '$lib/header/Header.svelte'
  import ResultTile from '$lib/ResultTile.svelte'

  export let result
</script>
<svelte:head>
	<title>{result.provider}’s “{result.title || result.keywords.join(' ')}”</title>
</svelte:head>


<Header />

<div>
  <ResultTile data={result} expand />
</div>

<style>
  div {
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 50vh;
  }
</style>