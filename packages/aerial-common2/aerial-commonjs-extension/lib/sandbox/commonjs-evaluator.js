"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aerial_sandbox_1 = require("aerial-sandbox");
class CommonJSSandboxEvaluator {
    evaluate(module) {
        const { source, sandbox } = module;
        const { content, hash } = source;
        const { global, vmContext } = sandbox;
        const script = aerial_sandbox_1.compileModuleSandboxScript(module.uri, hash, content);
        const resolve = (url) => {
            return source.eagerGetDependency(url);
        };
        const require = (relativePath) => {
            const dep = resolve(relativePath);
            // DEP may not exist, especially if loaded by a NULL loader.
            return dep && sandbox.evaluate(dep);
        };
        require.resolve = resolve;
        const context = source.graph.createModuleContext(module);
        Object.assign(context, { global, require });
        aerial_sandbox_1.runModuleSandboxScript(script, hash, sandbox, context);
    }
}
exports.CommonJSSandboxEvaluator = CommonJSSandboxEvaluator;
//# sourceMappingURL=commonjs-evaluator.js.map