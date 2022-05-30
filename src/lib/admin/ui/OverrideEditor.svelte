<script lang="ts">
  import type { IndexOverride } from '$lib/models/index-override'
  import type { EncodedSearchDataEntry } from '$lib/orthagonal/types'
  import { createEventDispatcher } from 'svelte'

  import OverrideField from './OverrideField.svelte'

  export let entry: EncodedSearchDataEntry
  export let override: IndexOverride

  const fire = createEventDispatcher()

  const knownTags = [
    'established', 'invented', 'description'
  ]

  type Field = {
    name: string,
    type: 'string' | 'string[]' | 'text' | 'boolean' | 'url' | 'nav' | 'author' | 'provider' | 'encoded-media[]' | 'encoded-media' | 'epochMs',
    label?: string,
    autocomplete?: string[],
    override?: boolean,
    value?: any
  }

  const fields: Field[] = [
    { name: 'id', type: 'string' },
    { name: 'published', type: 'boolean', label: 'Should this be included in the search results?'},
    { name: 'title', type: 'string' },
    { name: 'words', type: 'string[]' },
    { name: 'tags', type: 'string[]', autocomplete: knownTags },
    { name: 'body', type: 'text' },
    { name: 'link', type: 'url' },
    { name: 'nav', type: 'nav' },
    { name: 'author', type: 'author' },
    { name: 'provider', type: 'provider' },
    { name: 'media', type: 'encoded-media[]' },
    { name: 'timestamp', type: 'epochMs' }
  ]

  for (const field of fields) {
    field.override = false
    field.value = entry[field.name]
  }

  function updateOverride () {
    override = Object.fromEntries(fields.map(x => [x.name, x.value]))
    fire('change', { override })
  }
</script>
<table>
  <thead><tr>
    <td>Field</td>
    <td>Override</td>
    <td>Value</td>
  </tr></thead>
  <tbody>
    {#each fields as field, idx}
      <tr>
        <OverrideField {...field} on:change={(event) => {
          fields[idx].value = event.detail.value
          fields[idx].override = event.detail.override
          updateOverride()
        }}/>
      </tr>
    {/each}
  </tbody>
</table>
