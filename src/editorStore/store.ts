import getState from '@/api/getState'
import updateState from '@/api/updateState'
import { GlobalStore } from '~/types/editorStore/global'
import { WorkspaceStore } from '~/types/editorStore/workspace'
import { ZodDefault, ZodType } from 'zod'

type StoreName = 'global' | 'local'

type Stores = GlobalStore | WorkspaceStore

type Config<T extends Stores> = {
  schema: ZodDefault<ZodType<T>>
  name: StoreName
}

class Store<T extends Stores> {
  public initialized = false

  private internalStore: T | null = null
  private schema: ZodDefault<ZodType<T>>
  private storeName: StoreName

  constructor(config: Config<T>) {
    this.storeName = config.name
    this.schema = config.schema
  }

  get store(): T {
    if (!this.initialized) {
      throw new Error('Store not initialized')
    }

    return { ...this.internalStore! }
  }

  set store(value: T) {
    if (!this.initialized) {
      throw new Error('Store not initialized')
    }

    this.schema.parse(value)

    this.internalStore = { ...value }

    this.saveStore()
  }

  async initStore() {
    const rawStore = await getState(this.storeName)

    let parsedStore = await this.schema.safeParseAsync(rawStore)

    if (!parsedStore.success) {
      parsedStore = await this.schema.safeParseAsync(undefined)

      if (!parsedStore.success) {
        throw new Error('Failed to parse store')
      }
    }

    this.internalStore = parsedStore.data

    this.initialized = true
  }

  private async saveStore() {
    if (!this.initialized) {
      throw new Error('Store not initialized')
    }

    await updateState(this.storeName, this.store!)
  }

  set<K extends keyof T>(key: K, value: T[K]) {
    if (!this.initialized) {
      throw new Error('Store not initialized')
    }

    this.store![key] = value
  }

  setValues(values: Partial<T>) {
    if (!this.initialized) {
      throw new Error('Store not initialized')
    }

    this.store = { ...this.store!, ...values }
  }

  get<K extends keyof T>(key: K): T[K] {
    if (!this.initialized) {
      throw new Error('Store not initialized')
    }

    return this.store![key]
  }
}

export default Store
