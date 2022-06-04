<script lang="ts">
  import type { EncodedSearchDataEntry } from '$lib/orthagonal/types'
  import SearchEntryViewer from '$lib/admin/ui/SearchEntryViewer.svelte'

  export let provider: string
  export let id: string
  export let entry: EncodedSearchDataEntry
</script>
<h1>{provider}: {id}</h1>

<SearchEntryViewer {entry} />