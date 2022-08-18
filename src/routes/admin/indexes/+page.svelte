<script lang=ts>
  throw new Error("@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)");

  import ProgressLogViewer from '$lib/progress/ProgressLogViewer.svelte'
  import { fn } from '$lib/models/filename-codec'
  import delay from '$lib/functions/delay'

  export let availableIndexes: string[]

  let rebuilding = {}

  async function rebuild (event, index, opts) {
    event.preventDefault()
    if (rebuilding[index]) {
      console.log('already rebuilding...')
    } else {
      const endpoint = fn`/admin/indexes/${index}/build?` + (opts.fast ? 'fast=1' : '')
      const response = await fetch(endpoint, { method: 'POST', body: '' })
      const json = await response.json()
      rebuilding[index] = { endpoint, id: json.progress.id, finished: false }
      rebuilding = rebuilding
    }
  }

  function indexURL (index) {
    return fn`/admin/indexes/${index}`
  }

  async function buildFinished (index) {
    rebuilding[index].finished = true
    rebuilding = rebuilding

    await delay(10 * 1000)
    delete rebuilding[index]
    rebuilding = rebuilding
  }
</script>
<ul>
  {#each availableIndexes as index}
    <li>
      <a href={indexURL(index)}>{index}</a>
      <div>
        <span class="controls">
          {#if rebuilding[index] && rebuilding[index].finished === false}
            [building...]
          {:else}
            [<a href="#update-{index}" on:click={(event) => rebuild(event, index, { fast: true })}>update</a>,
            <a href="#rebuild-{index}" on:click={(event) => rebuild(event, index, { fast: false })}>rebuild</a>]
          {/if}
        </span>

        {#if rebuilding[index]}
          <ProgressLogViewer
            endpoint={rebuilding[index].endpoint}
            id={rebuilding[index].id}
            on:finished={() => buildFinished(index)} />
        {/if}
      </div>
    </li>
  {/each}
</ul>

<style>
  .controls { opacity: 0.5 }
</style>