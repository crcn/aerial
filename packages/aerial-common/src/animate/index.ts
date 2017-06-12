
export function tween(start: number, end: number, duration: number, iterate: Function, ease: Function = easeNone, complete: Function = () => {}) {
  const change = end - start;
  const startTime = Date.now();
  const fps = 1000 / 30;
  let _break = false;
  function tick() {
    if (_break) return;
    const currentTime = Math.min(Date.now() - startTime, duration);
    const currentValue = start + change * ease(currentTime / duration);
    iterate(currentValue);
    if (currentTime === duration) {
      return complete();
    }
    setTimeout(tick, fps);
  }
  tick();

  return {
    dispose() {
      _break = true;
    }
  };
}

export function easeInCubic(t) {
  return t * t * t;
}

export function easeNone(t) {
  return t;
}

export function easeOutCubic(t) {
  return (--t) * t * t + 1;
}