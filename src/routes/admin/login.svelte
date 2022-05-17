<script lang=ts>
  import { goto } from '$app/navigation'

  import PasskeyLogin from '$lib/passkey/PasskeyLogin.svelte'
  import PasskeyRegister from '$lib/passkey/PasskeyRegister.svelte'

  function onAuthenticated () {
    goto('/admin')
  }
</script>
<PasskeyLogin on:authenticated={onAuthenticated} />
<PasskeyRegister on:authenticated={onAuthenticated} />