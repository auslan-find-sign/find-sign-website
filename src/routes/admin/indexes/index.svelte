<script lang=ts>
  export let providers: string[]

  let rebuilding = []

  async function rebuild (event, provider) {
    event.preventDefault()
    if (rebuilding.includes(provider)) {
      console.log('already rebuilding...')
    } else {
      rebuilding = [...rebuilding, provider]
      const response = await fetch(`/admin/indexes/${encodeURIComponent(provider)}/build`, {
        method: 'POST',
        body: ''
      })
      console.log(await response.json())
      rebuilding = rebuilding.filter(x => x !== provider)
    }
  }
</script>
<ul>
  {#each providers as provider}
    <li>
      <a href="/admin/indexes/{encodeURIComponent(provider)}">{provider}</a>
      [{#if rebuilding.includes(provider)}building...{:else}<a href="#rebuild-{provider}" on:click={(event) => rebuild(event, provider)}>rebuild</a>{/if}]
    </li>
  {/each}
</ul>