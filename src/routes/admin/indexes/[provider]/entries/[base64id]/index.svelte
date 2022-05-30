<script lang="ts">
  import type { EncodedSearchDataEntry } from '$lib/orthagonal/types'

  export let provider: string
  export let id: string
  export let entry: EncodedSearchDataEntry
</script>
<h1>{provider}: {id}</h1>

<dl>
  {#each Object.entries(entry) as [key, value]}
    <dt>{key}:</dt>
    <dd><code>{JSON.stringify(value)}</code></dd>
  {/each}
</dl>