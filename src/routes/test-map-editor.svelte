<script>
  import RegionMap from '$lib/RegionMap.svelte'

  export let tags = []
</script>

<div>
  <RegionMap editable bind:tags width=250 height=250 />

  <h2>tags:</h2>
  <p>{JSON.stringify(tags)}</p>
</div>
