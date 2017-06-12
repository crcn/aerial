export { default as startDrag } from "./start-drag";

export function getStyle(props, styleName, defaults) {
  if (!props.styles || !props.styles[styleName]) return defaults;
  return props.styles[styleName];
}

