<script lang="ts">
  import type { AuditLogEntry } from "$lib/models/audit-log"
  import { humane } from "$lib/functions/date"
  import MainBlock from "$lib/MainBlock.svelte"
  import Paginator from "$lib/Paginator.svelte"
  import { encodeFilename } from "$lib/models/filename-codec"

  export let pageEntries: AuditLogEntry[]
  export let currentPage: number
  export let totalPages: number
</script>

<h1>Audit Log</h1>

{#each pageEntries as entry}
  <MainBlock>
    <p><a href="/admin/users/{encodeURIComponent(entry.actor)}">{entry.actor}</a> performed <code>{entry.actionType}</code></p>
    <p><code>{entry.message}</code></p>
    {#if entry.extra}
      {#if entry.extra.publicURL}Public URL: <a href={entry.extra.publicURL}>{entry.extra.publicURL}</a>{/if}
      {#if entry.extra.adminURL}Admin URL: <a href={entry.extra.adminURL}>{entry.extra.adminURL}</a>{/if}
      {#if entry.extra.index}Index: <a href={`/sign/${encodeFilename(entry.extra.index)}`}>{entry.extra.index}</a>{/if}
      {#if entry.extra.index && entry.extra.entryID}Entry ID: <a href={`/sign/${encodeFilename(entry.extra.index)}/${encodeFilename(entry.extra.entryID)}`}>{entry.extra.entryID}</a>{/if}
      {#if entry.extra.object}<pre><code>{JSON.stringify(entry.extra.object, null, 2)}</code></pre>{/if}
    {/if}
    <p><time>{humane(entry.time)}</time></p>
  </MainBlock>
{/each}

<Paginator length={totalPages} selected={currentPage} let:page>{page}</Paginator>
