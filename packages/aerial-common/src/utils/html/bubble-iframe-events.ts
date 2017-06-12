import { calculateAbsoluteBounds } from "./transform";


export function bubbleHTMLIframeEvents(iframe: HTMLIFrameElement, options: { translateMousePositions?: boolean, ignoreInputEvents?: boolean, ignoreScrollEvents?: boolean } = {}) {
  const window = iframe.contentWindow;
  const body   = window.document.childNodes[0];
  const translateMousePositions = options.translateMousePositions !== false;

  // TODO - this should be in its own util function
  function bubbleEvent(event) {

    if (/key|input/.test(event.type) && options.ignoreInputEvents && (/textarea|input/i.test(event.target.nodeName) || event.target.contentEditable === "true")) {
      return;
    }

    const clonedEvent = new Event(event.type, {
      bubbles: true,
      cancelable: true
    });


    
    const rect = iframe.getBoundingClientRect();
    const actualRect = calculateAbsoluteBounds(iframe);
    const zoom = rect.width / actualRect.width;

    for (let key in event) {
      let value = event[key];
      if (typeof value === "function") {
        value = value.bind(event);
      }

      if (translateMousePositions) {
        if (key === "pageX" || key === "clientX") {
          value = rect.left + value * zoom;
        }

        if (key === "pageY" || key === "clientY") {
          value = rect.top + value * zoom;
        }
      }

      // bypass read-only issues here
      try {
        clonedEvent[key] = value;
      } catch (e) { }
    }

    iframe.dispatchEvent(clonedEvent);

    if (clonedEvent.defaultPrevented) {
      event.preventDefault();
    }
  }

  const eventTypes = [
    "keypress",
    "copy",
    "dragenter",
    "dragexit",
    "drop",
    "paste",
    "mousemove",
    "mousedown",
    "mouseup",
    "keyup",
    "keydown"
  ];

  for (let eventType of eventTypes) {
    body.addEventListener(eventType, bubbleEvent);
  }

  if (options.ignoreScrollEvents !== true) {
    window.addEventListener("wheel", bubbleEvent);
    window.addEventListener("scroll", bubbleEvent);
  }
}
