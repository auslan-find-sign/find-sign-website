<script lang=ts>
  import { session } from "$app/stores"

  export let powers: string[]
</script>
Hey there “{$session.username}”. You have rights to {powers.length === 0 ? 'do nothing' : powers.join(', ')}.

<a href="/admin/logout">Logout</a>