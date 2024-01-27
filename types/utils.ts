import { UnwrapRef } from 'vue'

/**
 * It returns arguments of a given function
 */
export type FunctionArguments<F> = F extends (...args: infer A) => any ?  A : never

/**
 * This type checks if type `T` is of type: `(...params: P) => R` and if yes, it applies context on it.
 * If not, it types it as `never` - for typing error indication.
 * */
export type ActionWithStore<T, S> = T extends (...params: infer P) => infer R
  ? (this: S, ...params: P) => R
  : never;


export type GetterWithState<T, S> = (state: UnwrapRef<S>) => T