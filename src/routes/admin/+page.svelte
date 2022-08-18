<script lang=ts>
  throw new Error("@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)");

  import { session } from "$app/stores"

  export let powers: string[]
</script>
Hey there “{$session.username}”. You have rights to {powers.length === 0 ? 'do nothing' : powers.join(', ')}.

<a href="/admin/logout">Logout</a>