"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var element_1 = require("./element");
var container_1 = require("./container");
var value_node_1 = require("./value-node");
var document_1 = require("../document");
function isDOMNodeMutation(mutation) {
    return element_1.isDOMElementMutation(mutation) || container_1.isDOMContainerMutation(mutation) || value_node_1.isDOMValueNodeMutation(mutation) || document_1.isDOMDocumentMutation(mutation);
}
exports.isDOMNodeMutation = isDOMNodeMutation;
//# sourceMappingURL=utils.js.map