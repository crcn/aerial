"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const utils_1 = require("../utils");
const recompose_1 = require("recompose");
const providers_1 = require("../../providers");
;
const RootComponentBase = ({ kernel, editorComponents }) => {
    return React.createElement("div", null, editorComponents.map((EditorComponent, i) => React.createElement(EditorComponent, { key: i })));
};
const enhanceRootComponent = recompose_1.compose(recompose_1.withContext({
    kernel: React.PropTypes.object
}, ({ kernel }) => ({ kernel })), utils_1.inject({
    editorComponents: [providers_1.EditorComponentProvider.getId("**")]
}));
exports.RootComponent = enhanceRootComponent(RootComponentBase);
//# sourceMappingURL=index.js.map