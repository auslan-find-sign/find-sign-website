<script lang="ts">
  import logo from '$lib/assets/find-sign-logo.svg'

	import { slide } from 'svelte/transition'
	import SearchInput from './SearchInput.svelte'

	export let showNavigation = true
  export let query = undefined
  export let formAction = '/search'
</script>

<header class={$$props.class} style={$$props.style}>
	<!-- header logo -->
  <a href="/" sveltekit:prefetch><img class=header alt="Home Button" src={logo} width=411 height=90></a>

  <!-- search query input bar -->
  <SearchInput bind:query {formAction} on:regionChange/>

  <!-- nav links to static pages on the site -->
  {#if showNavigation}
    <nav transition:slide|local>
      <a href=/random sveltekit:prefetch>Random</a>
      <a href=/about sveltekit:prefetch>About</a>
      <a href=/technology sveltekit:prefetch>Technology</a>
      <a href="https://blog.auslan.fyi/">News</a>
    </nav>
  {/if}
</header>

<style>
	header {
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 1rem;
  }

  header > a {
    display: block;
    cursor: pointer;
    width: auto;
    margin-top: 4rem;
    margin-left: auto;
    margin-right: auto;
    padding-bottom: 1.5rem;
  }

  @media (max-width: 500px) {
    header > a {
      margin-top: 13vw;
    }
  }

  img.header {
    -webkit-user-select: none;
       -moz-user-select: none;
        -ms-user-select: none;
            user-select: none;
    display: block;
    width: 100%;
    height: auto;
  }

  nav {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    width: auto;
    padding: 2.5rem 0 1.5rem 0;
    margin: 0 auto 0 auto;
    font-size: 1.2em;
  }

  @media (max-width: 350px) {
    nav { font-size: 1em; }
  }

  @media (max-width: 280px) {
    nav { display: block; }
    nav a { display: block; text-align: center; }
  }

  nav > a {
    color: inherit;
  }
</style>
