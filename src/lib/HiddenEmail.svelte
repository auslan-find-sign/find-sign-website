<script lang="ts">
  export let user: string
  export let domain: string

  function doMailto (event) {
    event.preventDefault()
    location.href = `mailto:${user}@${domain}`
  }
</script>
<!-- svelte-ignore a11y-invalid-attribute -->
<a href="#" on:click={doMailto} data-u={user} data-d={domain}>@</a>
<style>
  a::before {
    content: attr(data-u);
  }
  a::after {
      content: attr(data-d);
  }
</style>