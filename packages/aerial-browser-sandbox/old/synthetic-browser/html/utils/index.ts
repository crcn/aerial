import { IPoint } from "aerial-common";
import { SyntheticHTMLElement } from "../element";

/**
 * Localizes a fixed point according to the relative element. In other words, convert the fixed point into one
 * that is relative to the element. 
 * 
 * TODO - need to consider right / bottom constraints
 */

export const localizeFixedPosition = (point: IPoint, element: SyntheticHTMLElement) => {

  // get the initial position (0, 0) of the element -- this is according to the position style - absolute, relative, or fixed
  const initialPosition = getInitialFixedPosition(element);

  // next, chop off the initial position from the fixed point passed in to ensure that the returned
  // value is localized according to the element's position style property.
  const localizedPosition = { left: point.left - initialPosition.left, top: point.top - initialPosition.top };

  // next, convert the position to the unit used by the element

  // finally, 

  return localizedPosition;
}

export const convertComputedStylePositionToPixels = (element: SyntheticHTMLElement) => {

  // for now do nothing
  const computedStyle = element.getComputedStyle();

  return {
    left   : computedStyle.left   && convertMeasurementToPixels(computedStyle.left, element),
    top    : computedStyle.top    && convertMeasurementToPixels(computedStyle.top, element),
    right  : computedStyle.right  && convertMeasurementToPixels(computedStyle.right, element),
    bottom : computedStyle.bottom && convertMeasurementToPixels(computedStyle.bottom, element)
  }
}

const getInitialFixedPosition = (element: SyntheticHTMLElement): IPoint => {

  const parentElement = element.parentElement as SyntheticHTMLElement;
  const parentRect   = parentElement.getBoundingClientRect();
  const targetRect   = element.getBoundingClientRect();
  const targetStyle  = element.getComputedStyle();
  const parentStyle  = parentElement.getComputedStyle();
  const positionType = targetStyle.position;

  if (positionType === "absolute") {
    return { left: parentRect.left, top: parentRect.top };
  } else if (positionType === "relative") {
    const targetStylePosition = convertComputedStylePositionToPixels(element);
    return { 
      left: targetRect.left - (targetStylePosition.left || 0),
      top: targetRect.top  - (targetStylePosition.top || 0)
    };
  } else if (positionType === "fixed") {
    return { left: 0, top: 0 };
  }
}

const convertMeasurementToPixels = (measurement: string, element: SyntheticHTMLElement) => {
  const [match, length, unit] = measurement.match(/([-\d\.]+)(\w+)?/);
  return Number(length);
}