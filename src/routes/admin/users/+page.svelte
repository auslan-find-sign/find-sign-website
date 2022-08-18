<script lang=ts>
  throw new Error("@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)");

  export let usernames: string[]
</script>
<ul>
  {#each usernames as user}
    <li><a href="/admin/users/{user}">{user}</a></li>
  {/each}
</ul>