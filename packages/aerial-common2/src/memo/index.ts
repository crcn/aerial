

export function weakMemo<TFunc extends (...args: any[]) => any>(func: TFunc, mapMemo: (value?: any) => any = (value => value)): TFunc {
  const memos = new Map();
  let count = 1;
  return function() {
    let hash = "";

    let cmemo = memos;

    for (let i = 0, n = arguments.length; i < n; i++) {
      const arg = arguments[i];

      let nmemo = cmemo.get(arg);
      
      if (!nmemo) {
        nmemo = new Map();
        cmemo.set(arg, nmemo);
      }

      cmemo = nmemo;
    }

    if (cmemo.has(hash)) {
      return mapMemo(cmemo.get(hash));
    } else {
      const result = func.apply(this, arguments);
      cmemo.set(hash, result);
      return mapMemo(result);
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
