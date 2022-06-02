<script lang="ts">
  import type { EncodedSearchDataEntry } from '$lib/orthagonal/types'
  import type { IndexOverride } from '$lib/models/index-override'
  import OverrideEditor from '$lib/admin/ui/OverrideEditor.svelte'

  export let entry: EncodedSearchDataEntry
  export let override: IndexOverride

  $: console.log(override)
</script>
<OverrideEditor {entry} bind:override/>