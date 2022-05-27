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
      rebuilding[provider] = { endpoint, id: json.progress.id, finished: false }
      rebuilding = rebuilding
    }
  }

  async function buildFinished (provider) {
    rebuilding[provider].finished = true
    rebuilding = rebuilding

    await delay(10 * 1000)
    delete rebuilding[provider]
    rebuilding = rebuilding
  }
</script>
<ul>
  {#each providers as provider}
    <li>
      <a href="/admin/indexes/{encodeURIComponent(provider)}">{provider}</a>
      {#if rebuilding[provider] && rebuilding[provider].finished === false}
        [building...]
      {:else}
        [<a href="#rebuild-{provider}" on:click={(event) => rebuild(event, provider)}>rebuild</a>]
      {/if}

      {#if rebuilding[provider]}
        <ProgressLogViewer
          endpoint={rebuilding[provider].endpoint}
          id={rebuilding[provider].id}
          on:finished={() => buildFinished(provider)} />
      {/if}
    </li>
  {/each}
</ul>