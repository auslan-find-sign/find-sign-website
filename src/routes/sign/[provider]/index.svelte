<script lang="ts" context="module">
  import siteConfig from '$lib/site-config.json'
  import { open, getProviderIDs } from '$lib/search/search-index'

  export async function load ({ params }) {
    const { provider } = params
    const library = await open(siteConfig.searchIndex)
    const ids = await getProviderIDs(library, provider)
    return { props: { provider, ids } }
  }
</script>
<script lang="ts">
  import Header from '$lib/header/Header.svelte'
  import MainBlock from '$lib/MainBlock.svelte'

  export let provider
  export let ids
</script>
<svelte:head>
	<title>Find Sign, List of “{provider}” entries</title>
</svelte:head>

<Header />

<MainBlock wide>
  <h1>List of “{provider}” entries</h1>
  <ul>
    {#each ids as id}
    <li><a href="/sign/{encodeURIComponent(provider)}/{encodeURIComponent(id)}">{id}</a></li>
    {/each}
  </ul>
</MainBlock>
