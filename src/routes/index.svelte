<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import Header from '$lib/header/Header.svelte'
	import DiscoveryFeed from '$lib/DiscoveryFeed.svelte'
	import { onMount } from 'svelte'
	import { prefetchRoutes } from '$app/navigation'

	onMount(() => {
		// preload the search results interface
		prefetchRoutes(['/search'])
	})
</script>

<svelte:head>
	<title>Find Sign</title>
	<meta property=og:image content=https://find.auslan.fyi/style/assets/open-graph-image@3x.png>
  <meta property=og:description content="Find Sign is an Auslan Search Engine. It helps find Auslan resources from around the internet in one place.">
  <meta property=og:title content="Find Sign - Auslan Search Engine">
</svelte:head>

<Header/>

<DiscoveryFeed/>