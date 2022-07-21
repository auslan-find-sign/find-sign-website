<script lang="ts" context="module">
  import { decodeFilename } from '$lib/models/filename-codec'
  import { getSearchLibrary } from '$lib/search/search'

  export async function load ({ params }) {
    const provider = decodeFilename(params.provider)
    const library = await getSearchLibrary([provider], ['id', 'title'], true)

    const results = library[provider].entries

    return { props: { provider, results } }
  }
</script>
<script lang="ts">
  import Header from '$lib/header/Header.svelte'
  import MainBlock from '$lib/MainBlock.svelte'

  export let provider
  export let results
</script>
<svelte:head>
	<title>Find Sign, List of “{provider}” entries</title>
</svelte:head>

<Header />

<MainBlock wide>
  <h1>List of “{provider}” entries</h1>
  <ul>
    {#each results as { id, title }}
      <li><a href={`/sign/${provider}/${id}`}>{id}: {title}</a></li>
    {/each}
  </ul>
</MainBlock>
