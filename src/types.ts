import { Setter, Getter, createStore } from 'jotai/vanilla';

export type nullish = null | undefined;
export type falsy = nullish | false;

export type Store = ReturnType<typeof createStore>;
export type Write<Args extends unknown[], Result> = (
    get: Getter,
    set: Setter,
    ...args: Args
  ) => Result