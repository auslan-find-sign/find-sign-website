<script lang="ts" context="module">
  import { availableIndexes } from '$lib/search/search'

  export async function load () {
    const providers = availableIndexes
    return { props: { providers } }
  }
</script>
<script lang="ts">
  import { encodeFilename } from '$lib/models/filename-codec'

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
      <li><a href="/sign/{encodeFilename(provider)}">{provider}</a></li>
    {/each}
  </ul>
</MainBlock>
