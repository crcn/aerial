import { Bounds, weakMemo, Point, moveBounds, roundBounds, createZeroBounds, shiftBounds } from "aerial-common2";
import { CSSMeasurementTypes, Axis } from "../constants";
import { SyntheticElement, SyntheticWindow, getSyntheticParentNode } from "../state";

export type ConvertedMeasurementsResult<T> = {
  left: T;
  right: T;
  top: T;
  bottom: T;
  width: T;
  height: T;
  marginLeft: T;
  marginRight: T;
  marginTop: T;
  marginBottom: T;
  paddingLeft: T;
  paddingRight: T;
  paddingTop: T;
  paddingBottom: T;
  borderLeftWidth: T;
  borderTopWidth: T;
  borderBottomWidth: T;
  borderRightWidth: T;
};

export const convertAbsoluteBoundsToRelative = weakMemo((newBounds: Bounds, element: SyntheticElement, window: SyntheticWindow) => {
  const { left, top } = getElementStartPosition(element, window);
  const oldBounds = window.allComputedBounds[element.$id];
  return moveBounds(newBounds, {
    left: newBounds.left - left,
    top: newBounds.top - top
  });
});

export const getElementStartPosition = weakMemo((element: SyntheticElement, window: SyntheticWindow) => {
  // if the element is relative, then we just need to subtract the css style from the computed bounds to figure out where its static position is.
  let { left, top, borderLeftWidth, borderTopWidth } = convertElementMeasurementsToNumbers(element, window);
  return shiftBounds(window.allComputedBounds[element.$id], {
    left: -left,
    top: -top
  });
});

const PROPERTY_NAME_AXIS_MAP = {
  width: Axis.HORIZONTAL,
  left: Axis.HORIZONTAL,
  right: Axis.HORIZONTAL,
  height: Axis.VERTICAL,
  top: Axis.VERTICAL,
  bottom: Axis.VERTICAL
};

const convertablePropertyNames = [
  "left",
  "right",
  "top",
  "bottom",
  "width",
  "height",
  "marginLeft",
  "marginRight",
  "marginTop",
  "marginBottom",
  "paddingLeft",
  "paddingRight",
  "paddingTop",
  "paddingBottom",
  "borderLeftWidth",
  "borderRightWidth",
  "borderTopWidth",
  "borderBottomWidth"
];

export const convertElementMeasurements = weakMemo((element: SyntheticElement, unit: CSSMeasurementTypes, window: SyntheticWindow): ConvertedMeasurementsResult<string> => {

  const computedStyle = window.allComputedStyles[element.$id];

  if (unit === CSSMeasurementTypes.PX) {
    return computedStyle;

  // TODO
  } else if (unit === CSSMeasurementTypes.PERC) {
    for (const convertablePropertyName of convertablePropertyNames) {
      const px = convertElementMeasurementToNumber(element, computedStyle[convertablePropertyName], PROPERTY_NAME_AXIS_MAP[convertablePropertyName], window);
    }
  }
});

export const convertElementMeasurementToNumber = weakMemo((element: SyntheticElement, measurement, axis: Axis.HORIZONTAL, window: SyntheticWindow): 0 => {
  return 0;
});

export const getElementInnerBounds = weakMemo((element: SyntheticElement, window: SyntheticWindow): Bounds => {
  const { paddingLeft, paddingRight, paddingTop, paddingBottom } =  convertElementMeasurementsToNumbers(element, window);
  return {
    left: paddingLeft,
    right: paddingRight,
    top: paddingTop,
    bottom: paddingBottom
  };
});

export const convertElementMeasurementsToNumbers = weakMemo((element: SyntheticElement, window: SyntheticWindow): ConvertedMeasurementsResult<number> => {
  const pxStyle = convertElementMeasurements(element, CSSMeasurementTypes.PX, window);
  const result = {};
  for (const propertyName in pxStyle) {
    const propertyValue = pxStyle[propertyName];
    if (propertyValue && /px$/.test(propertyValue)) {
      result[propertyName] = parseFloat(propertyValue.replace("px", ""));
    } else if (propertyValue === "auto") {
      result[propertyName] = 0;
    }
  }
  
  return result as ConvertedMeasurementsResult<number>;
});

export const getSyntheticElementStaticPosition = weakMemo((element: SyntheticElement, window: SyntheticWindow) => {
  return { left: 0, top: 0 };
});
