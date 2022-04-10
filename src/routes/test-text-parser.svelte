<script>
  import Header from "$lib/header/Header.svelte"
import MainBlock from "$lib/MainBlock.svelte"
  import { parseQuery } from '$lib/search/text'

  let query = ''
  $: parsed = JSON.stringify(parseQuery(query), null, 2)
</script>

<Header bind:query/>

<MainBlock>
  <pre>{parsed}</pre>
</MainBlock>