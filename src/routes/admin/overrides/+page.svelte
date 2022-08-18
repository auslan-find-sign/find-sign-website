<script lang="ts">
  throw new Error("@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)");

  import { fn } from '$lib/models/filename-codec'

  export let overrides
</script>
<ul>
  {#each overrides as { provider, id }}
    <li><a href={fn`/admin/overrides/${provider}:${id}`}>{provider}: {id}</a></li>
  {/each}
</ul>