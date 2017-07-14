export type Reader<T, U> = ((input: T) => U) & {
  $$monadType: "reader";

  andThen: <V>(_then: (input: U) => (V | Reader<T, V>)) => Reader<T, V>;
};

export const reader = <T, U>(fn: (input: T) => U): Reader<T, U> => {
  const monad = ((value: T) => fn(value)) as Reader<T, U>;
  monad.$$monadType = "reader";
  monad.andThen = <V>(_then: (input: U) => (V | Reader<T, V>)) => reader(
    (input: T) => {
      const ret = _then(monad(input))
      return ret["$$monadType"] === "reader" ? (ret as Reader<T, V>)(input) : ret as V;
    }
  )
  return monad;
};
