"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Types
 */
exports.RENDERED_DOCUMENT = "RENDERED_DOCUMENT";
exports.EVALUATED_APPLICATION = "EVALUATED_APPLICATION";
exports.OPEN_SYNTHETIC_WINDOW_REQUESTED = "OPEN_SYNTHETIC_WINDOW_REQUESTED";
exports.CLOSE_SYNTHETIC_WINDOW_REQUESTED = "CLOSE_SYNTHETIC_WINDOW_REQUESTED";
exports.LEGACY_SYNTHETIC_DOM_CHANGED = "LEGACY_SYNTHETIC_DOM_CHANGED";
exports.SYNTHETIC_WINDOW_TITLE_CHANGED = "SYNTHETIC_WINDOW_TITLE_CHANGED";
/**
 * Factories
 */
exports.openSyntheticWindowRequested = function (syntheticBrowserId, location) { return ({
    syntheticBrowserId: syntheticBrowserId,
    location: location,
    type: exports.OPEN_SYNTHETIC_WINDOW_REQUESTED,
}); };
exports.closeSyntheticWindowRequested = function (syntheticWindowId) { return ({
    type: exports.CLOSE_SYNTHETIC_WINDOW_REQUESTED,
    syntheticWindowId: syntheticWindowId,
}); };
exports.legacySyntheticDOMChanged = function (syntheticWindowId, legacyDocument, mutation) { return ({
    syntheticWindowId: syntheticWindowId,
    legacyDocument: legacyDocument,
    type: exports.LEGACY_SYNTHETIC_DOM_CHANGED,
    mutation: mutation,
}); };
exports.syntheticWindowTitleChanged = function (syntheticWindowId, title) { return ({
    syntheticWindowId: syntheticWindowId,
    title: title,
    type: exports.SYNTHETIC_WINDOW_TITLE_CHANGED
}); };
//# sourceMappingURL=index.js.map