<script lang=ts>
  type UserInfo = {
    id: string,
    username: string
  }

  export let users: UserInfo[]
</script>
<ul>
  {#each users as user}
    <li><a href="/admin/users/{user.id}" title={user.id}>{user.username}</a></li>
  {/each}
</ul>