export type NullToUndef<T> = T extends null
  ? undefined
  : T extends object
    ? { [K in keyof T]: NullToUndef<T[K]> }
    : T;
