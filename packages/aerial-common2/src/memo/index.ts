

export function weakMemo<TFunc extends (...args: any[]) => any>(func: TFunc): TFunc {
  const memos = new Map();
  const key   = Symbol();
  let count = 1;
  return function() {
    let hash = "";

    for (let i = 0, n = arguments.length; i < n; i++) {
      const arg = arguments[i];
      hash += ":" + (arg[key] || (arg[key] = count++)) && arg[key] || arg;
    }

    if (memos.has(hash)) {
      return memos.get(hash);
    } else {
      const result = func.apply(this, arguments);
      memos.set(hash, result);
      return result;
    }
  } as any as TFunc;
};

/**
 * Calls target function once & proxies passed functions
 * @param fn 
 */

export const underchange = <TFunc extends Function>(fn: TFunc) => {
  let currentArgs = [];
  let ret: any;
  let started: boolean;

  const start = () => {
    if (started) {
      return ret;
    }
    started = true;
    return ret = fn(...currentArgs.map((a, i) => (...args) => currentArgs[i](...args)));
  }

  return ((...args) => {
    currentArgs = args;
    return start();
  }) as any as TFunc;
};
