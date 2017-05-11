"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Localizes a fixed point according to the relative element. In other words, convert the fixed point into one
 * that is relative to the element.
 *
 * TODO - need to consider right / bottom constraints
 */
exports.localizeFixedPosition = function (point, element) {
    // get the initial position (0, 0) of the element -- this is according to the position style - absolute, relative, or fixed
    var initialPosition = getInitialFixedPosition(element);
    // next, chop off the initial position from the fixed point passed in to ensure that the returned
    // value is localized according to the element's position style property.
    var localizedPosition = { left: point.left - initialPosition.left, top: point.top - initialPosition.top };
    // next, convert the position to the unit used by the element
    // finally, 
    return localizedPosition;
};
exports.convertComputedStylePositionToPixels = function (element) {
    // for now do nothing
    var computedStyle = element.getComputedStyle();
    return {
        left: computedStyle.left && convertMeasurementToPixels(computedStyle.left, element),
        top: computedStyle.top && convertMeasurementToPixels(computedStyle.top, element),
        right: computedStyle.right && convertMeasurementToPixels(computedStyle.right, element),
        bottom: computedStyle.bottom && convertMeasurementToPixels(computedStyle.bottom, element)
    };
};
var getInitialFixedPosition = function (element) {
    var parentElement = element.parentElement;
    var parentRect = parentElement.getBoundingClientRect();
    var targetRect = element.getBoundingClientRect();
    var targetStyle = element.getComputedStyle();
    var parentStyle = parentElement.getComputedStyle();
    var positionType = targetStyle.position;
    if (positionType === "absolute") {
        return { left: parentRect.left, top: parentRect.top };
    }
    else if (positionType === "relative") {
        var targetStylePosition = exports.convertComputedStylePositionToPixels(element);
        return {
            left: targetRect.left - (targetStylePosition.left || 0),
            top: targetRect.top - (targetStylePosition.top || 0)
        };
    }
    else if (positionType === "fixed") {
        return { left: 0, top: 0 };
    }
};
var convertMeasurementToPixels = function (measurement, element) {
    var _a = measurement.match(/([-\d\.]+)(\w+)?/), match = _a[0], length = _a[1], unit = _a[2];
    return Number(length);
};
//# sourceMappingURL=index.js.map