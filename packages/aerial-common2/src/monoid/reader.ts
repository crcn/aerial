export type ReaderTarget<T, U> = (input: T) => (U | Promise<U>);

export type Reader<T, U> = ReaderTarget<T, U> & {
  andThen: <V>(_then: (input: U) => (V | Promise<V> | ReaderTarget<T, V>)) => Reader<T, V>;
};

export const reader = <T, U>(fn: ReaderTarget<T, U>): Reader<T, U> => {
  const monad = ((value: T) => fn(value)) as Reader<T, U>;
  monad.andThen = <V>(_then: (input: U) => (V | ReaderTarget<T, V>)) => reader(
    (input: T) => {

      const map = (value: U) => {
        const ret = _then(value);
        return typeof ret === "function" ? ret(input) : ret;
      }
      
      const output = monad(input);
      
      if (output && (output as Promise<U>).then) {
        return new Promise<V>((resolve) => {
          (output as Promise<U>).then((value) => {
            resolve(map(value));
          });
        });
      }
      
      return map(output as U);
    }
  )
  return monad;
};
