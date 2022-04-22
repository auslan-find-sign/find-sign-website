<script lang="ts">
  import Spinner from '$lib/Spinner.svelte'

  let active = true
</script>

<Spinner bind:active/>

<button on:click={() => active = true}>load</button>
<button on:click={() => active = false}>finish</button>