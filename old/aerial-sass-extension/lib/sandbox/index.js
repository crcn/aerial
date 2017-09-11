"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scss_editor_1 = require("./scss-editor");
const constants_1 = require("../constants");
const aerial_common_1 = require("aerial-common");
const aerial_sandbox_1 = require("aerial-sandbox");
exports.createSASSSandboxProviders = () => {
    return [
        // deprecated for now since node-sass is an pain to get implemented with electron
        new aerial_sandbox_1.ContentEditorFactoryProvider(constants_1.SASS_MIME_TYPE, scss_editor_1.SCSSEditor),
        new aerial_common_1.MimeTypeProvider("scss", constants_1.SASS_MIME_TYPE)
    ];
};
//# sourceMappingURL=index.js.map