<script lang=ts>
  import type { UserAccountJSON } from '$lib/models/user'

  export let user: UserAccountJSON
</script>
Hey there {user.id}