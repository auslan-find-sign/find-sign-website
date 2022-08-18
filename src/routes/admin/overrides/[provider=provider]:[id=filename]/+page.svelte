<script lang="ts">
  throw new Error("@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)");

  import type { EncodedSearchDataEntry } from '$lib/orthagonal/types'
  import type { IndexOverride } from '$lib/models/index-override'
  import OverrideEditor from '$lib/admin/ui/OverrideEditor.svelte'

  export let entry: EncodedSearchDataEntry
  export let override: IndexOverride

  $: console.log(override)
</script>
<OverrideEditor {entry} bind:override/>