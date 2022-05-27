<script type="ts">
import ProgressLogViewer from "$lib/progress/ProgressLogViewer.svelte"

  export let id: string

  const endpoint = 'progress-log/__data.json'
</script>
<ProgressLogViewer {endpoint} {id} />