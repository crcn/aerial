"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vm = require("vm");
var _cache = {};
function compileSandboxScript(uri, hash, createSource) {
    // Using string concatenation here to preserve line numbers.
    return _cache[hash] || (_cache[hash] = new vm.Script(createSource(), {
        filename: uri,
        displayErrors: true
    }));
}
// Ugly, but native constructors can only be used from the global object if they are
// defined within a VM context.
var GLOBAL_FIX_SHIM = "var __global = typeof window === 'undefined' ? global : window; if (!__global.Object)" +
    "Object.assign(__global, { Object, Array, String, Math, Number , Boolean, Date, Function, RegExp, TypeError }); ";
setInterval(function () {
    _cache = {};
}, 1000 * 60);
function compileModuleSandboxScript(uri, hash, content) {
    // Using string concatenation here to preserve line numbers.
    return compileSandboxScript(uri, hash + content, function () {
        return "with($$contexts['" + hash + "']) {" +
            GLOBAL_FIX_SHIM +
            // guard from global context values from being overwritten.
            "(function(){" +
            // new line in case there's comment
            content + "\n" +
            "})();" +
            "}";
    });
}
exports.compileModuleSandboxScript = compileModuleSandboxScript;
function runModuleSandboxScript(script, hash, _a, context) {
    var global = _a.global, vmContext = _a.vmContext;
    if (!global.$$contexts)
        global.$$contexts = {};
    global.$$contexts[hash] = context;
    script.runInContext(vmContext);
}
exports.runModuleSandboxScript = runModuleSandboxScript;
function runGlobalSandboxScript(script, _a) {
    var global = _a.global, vmContext = _a.vmContext;
    script.runInContext(vmContext);
}
exports.runGlobalSandboxScript = runGlobalSandboxScript;
function compileGlobalSandboxScript(uri, hash, content) {
    return compileSandboxScript(uri, hash + content, function () {
        return GLOBAL_FIX_SHIM + content;
    });
}
exports.compileGlobalSandboxScript = compileGlobalSandboxScript;
//# sourceMappingURL=utils.js.map