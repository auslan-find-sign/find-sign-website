<script lang=ts>
  export let id: string
  export let username: string
  export let powers: string[]
</script>
Hey there “{username}” ({id}). You have rights to {powers.join(', ')}.