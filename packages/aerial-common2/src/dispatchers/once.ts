export const once = <TFunc extends Function>(fn: TFunc) => {
  let _called = false;
  return (...args) => {
    if (_called) return;
    _called = true;
    return fn(...args);
  };
};