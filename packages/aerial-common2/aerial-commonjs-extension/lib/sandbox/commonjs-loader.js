"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const aerial_common_1 = require("aerial-common");
const detective = require("detective");
class CommonJSandboxLoader {
    constructor() {
    }
    load(dependency, { type, content }) {
        return __awaiter(this, void 0, void 0, function* () {
            content = String(content);
            const dependencies = detective(content);
            return {
                type: aerial_common_1.JS_MIME_TYPE,
                content: content,
                importedDependencyUris: dependencies
            };
        });
    }
}
exports.CommonJSandboxLoader = CommonJSandboxLoader;
//# sourceMappingURL=commonjs-loader.js.map