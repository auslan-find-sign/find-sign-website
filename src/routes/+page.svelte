<script lang="ts">
	throw new Error("@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)");

	import Header from '$lib/header/Header.svelte'
	import DiscoveryFeed from '$lib/DiscoveryFeed.svelte'
	import { onMount } from 'svelte'
	import { prefetchRoutes } from '$app/navigation'
	import openGraphImage from '$lib/assets/open-graph-image@3x.png'
	import { page } from '$app/stores'

	export let feed

	const openGraphImageFullURL = (new URL(openGraphImage, $page.url)).toString()

	onMount(() => {
		// preload the search results interface
		prefetchRoutes(['/search'])
	})
</script>

<svelte:head>
	<title>Find Sign</title>
	<meta property=og:image content={openGraphImageFullURL}>
  <meta property=og:description content="Find Sign is an Auslan Search Engine. It helps find Auslan resources from around the internet in one place.">
  <meta property=og:title content="Find Sign - Auslan Search Engine">
</svelte:head>

<Header/>

<DiscoveryFeed {feed} />