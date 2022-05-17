<script lang=ts>
  import Icon from '$lib/Icon.svelte'

  export let id: string
  export let username: string
  export let powers: string[]
  export let created: number
  export let canEdit: boolean

  let newPower = ''

  function removePower (power) {
    powers = powers.filter(p => p !== power)
  }

  async function update (event) {
    event.preventDefault()
    const response = await fetch('', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username, powers })
    })
    const output = await response.json()
    id = output.id
    username = output.username
    powers = output.powers
    created = output.created
  }
</script>
<form on:submit={update}>
  <dl>
    <dt>Passkey ID</dt>
    <dd>{id}</dd>

    <dt><label for="username">Name</label></dt>
    <dd><input name="username" bind:value={username}></dd>

    <dt>Powers</dt>
    <dd>
      <ul>
        {#each powers as power}
        <li>{power} <span on:click={() => removePower(power)}>❌</span></li>
        {/each}
        <input bind:value={newPower}>
        <input type="button" value="add power" on:click={() => { powers = [...powers, newPower]; newPower = '' }}>
      </ul>
    </dd>

    <dt>Account Created</dt>
    <dd>{(new Date(created)).toLocaleString()}</dd>
  </dl>
  <button type=submit disabled={!canEdit}>Save Changes</button>
</form>
<style>
  li span { cursor: pointer }
</style>