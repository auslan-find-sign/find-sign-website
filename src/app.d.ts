/// <reference types="@sveltejs/kit" />
import type { Username } from '$lib/models/user'

// See https://kit.svelte.dev/docs/types#the-app-namespace
// for information about these interfaces
declare namespace App {
	interface Locals {
		username?: Username;
	}

	// interface Platform {}

	interface Session {
		username?: Username;
	}

	// interface Stuff {}
}
