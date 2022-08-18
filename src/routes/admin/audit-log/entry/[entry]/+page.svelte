<script lang="ts">
  throw new Error("@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)");

  import type { AuditLogEntry } from "$lib/models/audit-log"
  import { humane } from "$lib/functions/date"
  import MainBlock from "$lib/MainBlock.svelte"
  import { encodeFilename } from "$lib/models/filename-codec"

  export let entry: AuditLogEntry
</script>

<h1>Audit Log Entry</h1>

<MainBlock>
  <h1><a href="/admin/users/{encodeURIComponent(entry.actor)}">{entry.actor}</a> performed <code>{entry.actionType}</code></h1>
  <p><code>{entry.message}</code></p>
  {#if entry.extra}
    <div>
      {#if entry.extra.publicURL}
        <div>Public URL: <a href={entry.extra.publicURL}>{entry.extra.publicURL}</a></div>
      {/if}
      {#if entry.extra.adminURL}
        <div>Admin URL: <a href={entry.extra.adminURL}>{entry.extra.adminURL}</a></div>
      {/if}
      {#if entry.extra.index}
        <div>Index: <a href={`/sign/${encodeFilename(entry.extra.index)}`}>{entry.extra.index}</a></div>
      {/if}
      {#if entry.extra.index && entry.extra.entryID}
        <div>Entry ID: <a href={`/sign/${encodeFilename(entry.extra.index)}/${encodeFilename(entry.extra.entryID)}`}>{entry.extra.entryID}</a></div>
      {/if}
      {#if entry.extra.object}
        <pre><code>{JSON.stringify(entry.extra.object, null, 2)}</code></pre>
      {/if}
    </div>
  {/if}
  <p><time>{humane(entry.time)} {(new Date(entry.time)).toLocaleTimeString()}</time></p>
</MainBlock>
