import { Box, weakMemo } from "aerial-common2";
import { SyntheticElement, SyntheticWindow, getSyntheticNodeAncestors } from "../state";

export const getAbsoluteElementBounds = weakMemo((element: SyntheticElement, window: SyntheticWindow) => {
  const ancestors = getSyntheticNodeAncestors(element, window);
  console.log(ancestors);
  return window.computedBoxes[element.$$id];
});

export const getRelativeElementBounds = weakMemo((element: SyntheticElement, window: SyntheticWindow) => {
  const ancestors = getSyntheticNodeAncestors(element, window);
  console.log(ancestors);
  return window.computedBoxes[element.$$id];
});

export const absoluteElementBoundsToRelative = weakMemo((bounds: Box, element: SyntheticElement, window: SyntheticWindow) => {
  return bounds;
});