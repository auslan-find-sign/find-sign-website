<script lang="ts">
  import TagsInput from 'svelte-tags-input'
  import { nanoid } from 'nanoid'

  export let type: string //'string' | 'string[]' | 'text' | 'boolean' | 'url' | 'nav' | 'author' | 'provider' | 'encoded-media[]' | 'encoded-media' | 'epochMs'
  export let name: string = nanoid()
  export let value: any
  export let autocomplete: string[] = []
  export let label: string = ''
</script>
{#if type === 'string'}
  <input type="text" bind:value={value} id={name} name={name}>
{:else if type === 'string[]'}
  <TagsInput
    id={name}
    name={name}
    bind:tags={value}
    addKeys={[13, 108]}
    onlyUnique
    autoComplete={autocomplete} />
{:else if type === 'text'}
  <textarea bind:value={value} id={name} name={name}></textarea>
{:else if type === 'boolean'}
  <input type="checkbox" id={name} name={name} bind:value={value}><label for={name}>{label}</label>
{:else if type === 'url'}
  <input type="url" id={name} name={name} bind:value={value}>
{:else}
  {JSON.stringify(value)} (editing unimplemented)
{/if}
