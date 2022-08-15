import { localStorageAdapter, persistentWritable } from 'svelte-persistent-writable'

const usernameStore = persistentWritable('', { storage: localStorageAdapter('username') })

export default usernameStore
