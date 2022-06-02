<script lang="ts">
  import { fn } from '$lib/models/filename-codec'

  export let overrides
</script>
<ul>
  {#each overrides as { provider, id }}
    <li><a href={fn`/admin/overrides/${provider}:${id}`}>{provider}: {id}</a></li>
  {/each}
</ul>