<script type="ts">
  throw new Error("@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)");

import ProgressLogViewer from "$lib/progress/ProgressLogViewer.svelte"

  export let id: string

  const endpoint = 'progress-log/__data.json'
</script>
<ProgressLogViewer {endpoint} {id} />