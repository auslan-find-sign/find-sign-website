<script lang="ts">
  throw new Error("@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)");

  import type { EncodedSearchDataEntry } from '$lib/orthagonal/types'
  import SearchEntryViewer from '$lib/admin/ui/SearchEntryViewer.svelte'

  export let provider: string
  export let id: string
  export let entry: EncodedSearchDataEntry
</script>
<h1>{provider}: {id}</h1>

<SearchEntryViewer {entry} />