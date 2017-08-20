import { Bounds, weakMemo } from "aerial-common2";
import { SyntheticElement, SyntheticWindow, getSyntheticNodeAncestors } from "../state";

export const getAbsoluteElementBounds = weakMemo((element: SyntheticElement, window: SyntheticWindow) => {
  const ancestors = getSyntheticNodeAncestors(element, window);
  console.log(ancestors);
  return window.allComputedBounds[element.$$id];
});

export const getRelativeElementBounds = weakMemo((element: SyntheticElement, window: SyntheticWindow) => {
  const ancestors = getSyntheticNodeAncestors(element, window);
  console.log(ancestors);
  return window.allComputedBounds[element.$$id];
});

export const absoluteElementBoundsToRelative = weakMemo((bounds: Bounds, element: SyntheticElement, window: SyntheticWindow) => {
  console.log(bounds);
  return bounds;
});