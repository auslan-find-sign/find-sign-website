<script type="ts">
  import progressConsumer from '$lib/progress/progress-consumer'
  import { onMount } from 'svelte'

  export let id: string
  export let progress = 0
  export let logs = []

  onMount(async () => {
    for await (const entry of progressConsumer('progress-log/__data.json', id)) {
      console.log(entry)
      if ('progress' in entry) progress = entry.progress
      if ('log' in entry) logs = [...logs, { timestamp: entry.timestamp, log: entry.log }]
    }
    logs = [...logs, { timestamp: Date.now(), log: ['finished!'] }]
  })
</script>

<p>Progress: {Math.round(progress * 100)}%</p>

<p>logs:</p>
{#each logs as { timestamp, log }}
  <div>{new Date(timestamp)}: {JSON.stringify(log)}</div>
{/each}
