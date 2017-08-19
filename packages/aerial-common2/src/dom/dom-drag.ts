
export const startDOMDrag = (startEvent: any, update: (event: MouseEvent, data?: { delta?: { x: number, y: number }}) => any, stop: Function = undefined) => {

  const sx = startEvent.clientX;
  const sy = startEvent.clientY;
  const doc = startEvent.target.ownerDocument;
  let _animating: boolean;
  
  const drag = (event) => {
    event.preventDefault();
    update(event, {
      delta: {
        x: event.clientX - sx,
        y: event.clientY - sy,
      },
    });
  };

  function cleanup() {
    doc.removeEventListener("mousemove", drag);
    doc.removeEventListener("mouseup", cleanup);
    if (stop) stop();
  }

  doc.addEventListener("mousemove", drag);
  doc.addEventListener("mouseup", cleanup);

  return {
    dispose: cleanup,
  };
};
