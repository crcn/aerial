import { throttle } from "lodash";

export const startDOMDrag = (startEvent: any, onStart: (event?: MouseEvent) => any, update: (event: MouseEvent, data?: { delta?: { x: number, y: number }}) => any, stop: Function = undefined) => {

  const sx = startEvent.clientX;
  const sy = startEvent.clientY;
  const doc = startEvent.target.ownerDocument;
  let _animating: boolean;
  let _started: boolean;

  // slight delay to prevent accidental drag from firing 
  // if the user does some other mouse interaction such as a double click.
  const drag = throttle((event) => {
    if (!_started) {
      _started = true;
      onStart(event);
    }
    event.preventDefault();
    update(event, {
      delta: {
        x: event.clientX - sx,
        y: event.clientY - sy,
      },
    });
  }, 10);

  function cleanup() {
    doc.removeEventListener("mousemove", drag);
    doc.removeEventListener("mouseup", cleanup);
    if (stop && _started) stop();
  }

  doc.addEventListener("mousemove", drag);
  doc.addEventListener("mouseup", cleanup);

  return {
    dispose: cleanup,
  };
};
