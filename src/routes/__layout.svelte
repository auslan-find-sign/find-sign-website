<script lang="ts" context="module">
	export const prerender = false
</script>
<script lang="ts">
	import Spinner from '$lib/Spinner.svelte'
	import { navigating, page } from '$app/stores'
	import { browser } from '$app/env'
	import '../app.css'

	$: loading = $navigating !== null

	$: query = browser ? $page.url.searchParams.get('query') : ''

	// is the page load towards a search results page?
	$: isSearchLoad = $navigating && $navigating.to.pathname === '/search'

	let showSpinner = false
	let timer = undefined
	$: if (loading === true && isSearchLoad === false) {
		if (timer) clearTimeout(timer)
		timer = setTimeout(() => showSpinner = true, 50)
	} else if (loading === false) {
		clearTimeout(timer)
		timer = undefined
		showSpinner = false
	}
</script>

<svelte:head>
  <meta name=viewport content="width=device-width">
</svelte:head>

<slot></slot>

{#if showSpinner}
	<div class="spinner-overlay">
		<Spinner active={true} />
	</div>
{/if}

<style>
	.spinner-overlay {
		position: fixed;
		top: 0; left: 0; right: 0; bottom: 0;
		display: grid;
		justify-items: center;
		align-items: center;
	}
</style>
