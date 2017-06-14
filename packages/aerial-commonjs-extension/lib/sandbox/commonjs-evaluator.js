"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_sandbox_1 = require("aerial-sandbox");
var CommonJSSandboxEvaluator = (function () {
    function CommonJSSandboxEvaluator() {
    }
    CommonJSSandboxEvaluator.prototype.evaluate = function (module) {
        var source = module.source, sandbox = module.sandbox;
        var content = source.content, hash = source.hash;
        var global = sandbox.global, vmContext = sandbox.vmContext;
        var script = aerial_sandbox_1.compileModuleSandboxScript(module.uri, hash, content);
        var resolve = function (url) {
            return source.eagerGetDependency(url);
        };
        var require = function (relativePath) {
            var dep = resolve(relativePath);
            // DEP may not exist, especially if loaded by a NULL loader.
            return dep && sandbox.evaluate(dep);
        };
        require.resolve = resolve;
        var context = source.graph.createModuleContext(module);
        Object.assign(context, { global: global, require: require });
        aerial_sandbox_1.runModuleSandboxScript(script, hash, sandbox, context);
    };
    return CommonJSSandboxEvaluator;
}());
exports.CommonJSSandboxEvaluator = CommonJSSandboxEvaluator;
//# sourceMappingURL=commonjs-evaluator.js.map