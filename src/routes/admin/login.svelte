<script lang=ts>
  import { goto } from '$app/navigation'

  import PasskeyLogin from '$lib/passkey/PasskeyLogin.svelte'
  import PasskeyRegister from '$lib/passkey/PasskeyRegister.svelte'

  function onAuthenticated () {
    goto('/admin')
  }
</script>
<p>
  Admin access is given to a few trusted people, whose actions are carefully
  recorded for accountability. Administrators may be given power to adjust the
  content of search results to correct technical glitches that sometimes occur
  in how this website downloads information from it's various source websites.
</p>
<p>
  Administrators may also have the ability to manually remove specific search
  results, and create and manage other kinds of data used by the website to
  create educational games and other future content.
</p>
<div><PasskeyLogin on:authenticated={onAuthenticated} /></div>
<div class="or-rule">or perhaps</div>
<div><PasskeyRegister on:authenticated={onAuthenticated} /></div>

<style>
  div { text-align: center }
  .or-rule {
    font-style: italic;
    margin: 1em auto;
  }

  .or-rule::before, .or-rule::after {
    content: " ";
    display: inline-block;
    background-color: currentColor;
    height: 1px;
    width: 3em;
    vertical-align: middle;
    margin: 0 1em;
  }
</style>