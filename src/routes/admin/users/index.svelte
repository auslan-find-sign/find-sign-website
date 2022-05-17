<script lang=ts>
  export let users: string[]
</script>
<ul>
  {#each users as user}
  <li><a href="/admin/users/{user}">{user}</a></li>
  {/each}
</ul>