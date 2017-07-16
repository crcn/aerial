export type ReaderTarget<T, U> = (input: T) => (U | Promise<U>);

export class Reader<T, U> {
  constructor(private __fn: ReaderTarget<T, U>) {
  }

  run = (input: T) => {
    return this.__fn(input);
  }

  bind = <V>(_then: (input: U) => (V | Promise<V> | Reader<T, V>)) => {
    return new Reader((input: T) => {
      const map = (value: U) => {
        const ret = _then(value);
        return ret instanceof Reader ? ret.run(input) : ret;
      }
      
      const output = this.__fn(input);
      
      if (output && (output as Promise<U>).then) {
        return new Promise<V>((resolve) => {
          (output as Promise<U>).then((value) => {
            resolve(map(value));
          });
        });
      }
      
      return map(output as U);
    });
  }
}

export const reader = <T, U>(fn: ReaderTarget<T, U>) => new Reader<T, U>(fn);

export namespace ReaderUtils {
  export const race = <T, U>(...fns: Reader<T, U>[]): Reader<T, U> => reader((input: T) => Promise.race(fns.map(r => r.run(input))));
}