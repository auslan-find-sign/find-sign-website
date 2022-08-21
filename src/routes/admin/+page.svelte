<script lang=ts>
  import type { PageData } from "./$types"
  import { session } from "$app/stores"

  export let data: PageData
</script>
Hey there “{$session.username}”. You have rights to {data.powers.length === 0 ? 'do nothing' : data.powers.join(', ')}.

<a href="/admin/logout">Logout</a>