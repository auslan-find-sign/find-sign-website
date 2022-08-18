<script lang="ts" context="module">
  throw new Error("@migration task: Check code was safely removed (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292722)");

  // import { decodeFilename } from '$lib/models/filename-codec'
  // import { getSearchLibrary } from '$lib/search/search'

  // export async function load ({ params }) {
  //   const index = decodeFilename(params.index)
  //   const library = await getSearchLibrary([index], ['id', 'title'], true)

  //   const results = library[index].entries

  //   return { props: { index, results } }
  // }
</script>
<script lang="ts">
  throw new Error("@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)");

  import { fn } from '$lib/models/filename-codec'
  import Header from '$lib/header/Header.svelte'
  import MainBlock from '$lib/MainBlock.svelte'

  export let index
  export let results

  function getURL (index, id) {
    return fn`/sign/${index}/${id}`
  }
</script>
<svelte:head>
	<title>Find Sign, List of “{index}” entries</title>
</svelte:head>

<Header />

<MainBlock wide>
  <h1>List of “{index}” entries</h1>
  <ul>
    {#each results as { id, title }}
      <li><a href={getURL(index, id)}>{title}</a> <span>({id})</span></li>
    {/each}
  </ul>
</MainBlock>

<style>
  ul li span {
    opacity: 0;
    font-size: 0.9em;
  }
  ul li:hover span {
    opacity: 0.5;
  }
</style>
