<script lang="ts">
  import { decodeUTF8, encodeBase64 } from 'tweetnacl-ts'

  export let meta
  export let entries
  export let provider

  const b64 = (str) => encodeBase64(decodeUTF8(str))
</script>

<pre><code>{JSON.stringify(meta, null, 2)}</code></pre>

<ol>
  {#each entries as entry}
    <li><a href="/admin/indexes/{encodeURIComponent(provider)}/entries/{(b64(entry.id))}">{entry.id}: {entry.title}</a></li>
  {/each}
</ol>