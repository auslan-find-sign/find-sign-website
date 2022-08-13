<script lang=ts>
  import { goto } from '$app/navigation'

  import PasskeyForm from '$lib/passkey/PasskeyForm.svelte'

  export let username = ""

  function onAuthenticated (...args) {
    console.log('onAuthenticated', ...args)
    // window.location.href = '/admin'
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
<PasskeyForm on:authenticated={onAuthenticated} />

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