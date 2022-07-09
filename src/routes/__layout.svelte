<script lang="ts" context="module">
	export const prerender = false;
</script>
<script lang="ts">
	import Header from '$lib/header/Header.svelte'
	import Spinner from '$lib/Spinner.svelte'
	import { navigating, page } from '$app/stores'
	import { browser } from '$app/env'
	import favicon from '$lib/assets/favicon-32x32.png'
	import '../app.css'

	$: loading = $navigating !== null

	$: query = browser ? $page.url.searchParams.get('query') : ''

	let showSpinner = false
	let timer = undefined
	$: if (loading === true) {
		if (timer) clearTimeout(timer)
		timer = setTimeout(() => showSpinner = true, 50)
	} else if (loading === false) {
		clearTimeout(timer)
		timer = undefined
		showSpinner = false
	}
</script>

<svelte:head>
	<link rel=icon type=image/png sizes=32x32 href={favicon}>
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
