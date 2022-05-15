<script lang="ts" context="module">
  import { open, getProviders } from '$lib/search/search-index'

  export async function load () {
    const library = await open(import.meta.env.VITE_SEARCH_INDEX)
    const providers = await getProviders(library)
    return { props: { providers } }
  }
</script>
<script lang="ts">
  import Header from '$lib/header/Header.svelte'
  import MainBlock from '$lib/MainBlock.svelte'

  export let providers
</script>
<svelte:head>
	<title>Find Sign, list of data sources</title>
</svelte:head>

<Header />

<MainBlock wide>
  <h1>List of Data Sources</h1>
  <ul>
    {#each providers as provider}
      <li><a href="/sign/{encodeURIComponent(provider)}">{provider}</a></li>
    {/each}
  </ul>
</MainBlock>
