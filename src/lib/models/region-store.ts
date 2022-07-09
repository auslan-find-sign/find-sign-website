import { localStorageAdapter, persistentWritable } from 'svelte-persistent-writable'

const regionStore = persistentWritable(false, { storage: localStorageAdapter('region') })

export default regionStore
