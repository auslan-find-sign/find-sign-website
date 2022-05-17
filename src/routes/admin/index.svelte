<script lang=ts>
  import { tick } from 'svelte'

  export let id: string
  export let username: string
  export let powers: string[]

  let editingUsername = false
  let usernameEditor

  async function editUsername (event) {
    event.preventDefault()
    editingUsername = true
    await tick()
    usernameEditor.focus()
  }

  function doneEditingUsername () {
    editingUsername = false
    fetch('', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username })
    })
  }

  function editorKeyup (event) {
    if (event.key === 'Enter') {
      doneEditingUsername()
    }
  }
</script>
Hey there “{
#if editingUsername
  }<input bind:this={usernameEditor} bind:value={username} on:blur={doneEditingUsername} on:keyup={editorKeyup}>{
:else
  }<a href="#edit-username" on:click={editUsername}>{username}</a>{
/if}” ({id}). You have rights to {powers.join(', ')}.

<a href="/admin/logout">Logout</a>