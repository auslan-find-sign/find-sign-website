<script lang="ts">
  import Header from '$lib/header/Header.svelte'
  import ResultTile from '$lib/ResultTile.svelte'

  export let result
</script>

<Header />

<ResultTile data={result} />