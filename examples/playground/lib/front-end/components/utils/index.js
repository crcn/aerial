"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const aerial_common_1 = require("aerial-common");
const recompose_1 = require("recompose");
exports.withKernel = (BaseComponent) => recompose_1.getContext({
    kernel: React.PropTypes.object
})(BaseComponent);
const defaultMapProviderValue = (provider) => provider.value;
exports.inject = (properties) => recompose_1.compose(exports.withKernel, recompose_1.withProps((props) => {
    const propMap = (typeof properties === 'function' ? properties(props) : properties);
    const newProps = {};
    for (const key in propMap) {
        const optionsOrMultiOptions = propMap[key];
        const multi = Array.isArray(optionsOrMultiOptions);
        const optionsOrId = multi ? optionsOrMultiOptions[0] : optionsOrMultiOptions;
        const { id, mapValue = defaultMapProviderValue } = typeof optionsOrId === 'string' ? { id: optionsOrId } : optionsOrId;
        newProps[key] = multi ? props.kernel.queryAll(id).map(mapValue) : mapValue(props.kernel.query(id));
    }
    return newProps;
}));
exports.withBus = () => exports.inject({ bus: aerial_common_1.PrivateBusProvider.ID });
//# sourceMappingURL=index.js.map