<script lang="ts" context="module">
  throw new Error("@migration task: Check code was safely removed (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292722)");

  // import { availableIndexes } from '$lib/search/search'

  // export async function load () {
  //   return {
  //     props: {
  //       indexes: availableIndexes
  //     }
  //   }
  // }
</script>
<script lang="ts">
  throw new Error("@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)");

  import { encodeFilename } from '$lib/models/filename-codec'

  import Header from '$lib/header/Header.svelte'
  import MainBlock from '$lib/MainBlock.svelte'

  export let indexes
</script>
<svelte:head>
	<title>Find Sign, list of data sources</title>
</svelte:head>

<Header />

<MainBlock wide>
  <h1>List of Data Sources</h1>
  <ul>
    {#each indexes as index}
      <li><a href="/sign/{encodeFilename(index)}">{index}</a></li>
    {/each}
  </ul>
</MainBlock>
