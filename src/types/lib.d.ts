declare type WithOptional<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>

declare type MaybeNull<T> = T | null

declare type MaybeUndefined<T> = T | undefined
