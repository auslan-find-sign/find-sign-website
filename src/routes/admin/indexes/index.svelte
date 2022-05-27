<script lang=ts>
import delay from '$lib/functions/delay';

  import ProgressLogViewer from '$lib/progress/ProgressLogViewer.svelte'
  export let providers: string[]

  let rebuilding = {}

  async function rebuild (event, provider) {
    event.preventDefault()
    if (rebuilding[provider]) {
      console.log('already rebuilding...')
    } else {
      const endpoint = `/admin/indexes/${encodeURIComponent(provider)}/build`
      const response = await fetch(endpoint, { method: 'POST', body: '' })
      const json = await response.json()
      rebuilding[provider] = { endpoint, id: json.progress.id }
    }
  }

  async function buildFinished (provider) {
    console.log('build finished!', provider)
    delete rebuilding[provider]
  }
</script>
<ul>
  {#each providers as provider}
    <li>
      <a href="/admin/indexes/{encodeURIComponent(provider)}">{provider}</a>
      {#if rebuilding[provider]}[building...]
        <ProgressLogViewer
          endpoint={rebuilding[provider].endpoint}
          id={rebuilding[provider].id}
          on:finished={() => buildFinished(provider)} />
      {:else}[<a href="#rebuild-{provider}" on:click={(event) => rebuild(event, provider)}>rebuild</a>]{/if}
    </li>
  {/each}
</ul>