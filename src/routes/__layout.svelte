<script context="module">
	export const prerender = true;
</script>

<script lang="ts">
	import Header from '$lib/header/Header.svelte'
	import Spinner from '$lib/Spinner.svelte'
	import { navigating } from '$app/stores'
	import favicon from '$lib/assets/favicon-32x32.png'
	import '../app.css'

	$: loading = $navigating !== null

	let showSpinner = false
	let timer = undefined
	$: if (loading === true) {
		if (timer) clearTimeout(timer)
		timer = setTimeout(() => showSpinner = true, 200)
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

{#if !showSpinner}
	<slot></slot>
{:else}
	<Header showNavigation={true} />
	<Spinner active={true} />
{/if}
