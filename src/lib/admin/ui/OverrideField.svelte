<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import SearchEntryFieldInput from './SearchEntryFieldInput.svelte'

  export let name: string
  export let type: string
  export let value: any = undefined
  export let label: string = ''
  export let autocomplete: string[] = []
  export let override: boolean = false

  const fire = createEventDispatcher()
  $: fire('change', { override, value })
</script>

<td><label for={name}>{name}</label></td>
<td><input type="checkbox" class="override" name="{name}-override" bind:value={override}></td>
<td>
  <SearchEntryFieldInput
    {name} {type} {label} {autocomplete}
    bind:value={value}/>
</td>