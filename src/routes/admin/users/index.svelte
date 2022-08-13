<script lang=ts>
  export let usernames: string[]
</script>
<ul>
  {#each usernames as user}
    <li><a href="/admin/users/{user}">{user}</a></li>
  {/each}
</ul>