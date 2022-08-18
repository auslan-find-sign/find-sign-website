<script lang="ts">
  throw new Error("@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)");

import { fn } from "$lib/models/filename-codec";


  export let meta
  export let entries
  export let provider

  function url (provider, id) {
    return fn`/admin/indexes/${provider}/entries/${id}`
  }

</script>

<pre><code>{JSON.stringify(meta, null, 2)}</code></pre>

<ol>
  {#each entries as entry}
    <li><a href={url(provider, entry.id)}>{entry.id}: {entry.title}</a></li>
  {/each}
</ol>