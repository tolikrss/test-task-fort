/** Array with a guaranteed first element: `arr[0]` is `T`, not `T | undefined`. */
export type NonEmptyArray<T> = [T, ...T[]];
