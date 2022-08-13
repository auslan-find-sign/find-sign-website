<script lang="ts">
  import type { AuditLogEntry } from "$lib/data-io/audit-log"
  import { humane } from "$lib/functions/date"
  import MainBlock from "$lib/MainBlock.svelte"
  import Paginator from "$lib/Paginator.svelte"

  export let pageEntries: AuditLogEntry[]
  export let currentPage: number
  export let totalPages: number
</script>

{#each pageEntries as entry}
  <MainBlock>
    <p>{entry.actor} performed {entry.actionType}</p>
    <p>{entry.message}</p>
    <p><time>{humane(entry.time)}</time></p>
  </MainBlock>
{/each}

<Paginator length={totalPages} selected={currentPage} let:page>{page}</Paginator>
