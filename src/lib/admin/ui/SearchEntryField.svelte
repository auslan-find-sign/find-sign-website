<script lang="ts">
  export let type: string //'string' | 'string[]' | 'text' | 'boolean' | 'url' | 'nav' | 'author' | 'provider' | 'encoded-media[]' | 'encoded-media' | 'epochMs'
  export let value: any
  export let label: string = ''
</script>
{#if value === undefined}
  unset
{:else if type === 'string'}
  {value}
{:else if type === 'string[]'}
  {value.join(', ')}
{:else if type === 'text'}
  <pre>{value}</pre>
{:else if type === 'boolean'}
  {value ? '✅' : '❌'} {label}
{:else if type === 'url'}
  <code>{value}</code>
{:else if type === 'epochMs'}
  {(new Date(value))}
{:else}
  <pre><code>{JSON.stringify(value, null, 2)}</code></pre>
{/if}
<style>
  pre, pre code {
    word-wrap: break-word;
  }
</style>