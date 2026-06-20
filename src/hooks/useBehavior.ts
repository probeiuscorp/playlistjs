import { Behavior } from ':/lib/execute/testable';
import { ReactElement, Reducer, useEffect, useReducer } from 'react';

const const2 = <T>(_: unknown, x: T) => x;
export function useBehavior<T>(behavior: Behavior<T>): T {
  const [state, setState] = useReducer<Reducer<T, T>>(const2, behavior.current);
  useEffect(() => {
    return behavior.onValue((value) => {
      setState(value);
    });
  });
  return state;
}

export function BehaviorConsumer<T>({ behavior, children }: {
    behavior: Behavior<T>
    children: (data: T) => ReactElement
}) {
  return children(useBehavior(behavior));
}
