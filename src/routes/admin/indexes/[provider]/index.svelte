<script lang="ts">
  export let meta
  export let entries
  export let provider
</script>

<pre><code>{JSON.stringify(meta, null, 2)}</code></pre>

<ol>
  {#each entries as entry}
    <li><a href="/admin/indexes/{encodeURIComponent(provider)}/entries/{encodeURIComponent(entry.id)}">{entry.title}</a></li>
  {/each}
</ol>