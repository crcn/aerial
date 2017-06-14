import vm =  require("vm");
import { Sandbox } from "./index";

let _cache = {};

function compileSandboxScript(uri: string, hash: string, createSource: () => string): vm.Script { 
  // Using string concatenation here to preserve line numbers.
  return _cache[hash] || (_cache[hash] = new vm.Script(createSource(), {
    filename: uri,
    displayErrors: true
  }));
}

// Ugly, but native constructors can only be used from the global object if they are
// defined within a VM context.
const GLOBAL_FIX_SHIM = "var __global = typeof window === 'undefined' ? global : window; if (!__global.Object)" +
"Object.assign(__global, { Object, Array, String, Math, Number , Boolean, Date, Function, RegExp, TypeError }); " ;

setInterval(() => {
  _cache = {};
}, 1000 * 60);

export function compileModuleSandboxScript(uri: string, hash: string, content: string): vm.Script {

  // Using string concatenation here to preserve line numbers.
  return compileSandboxScript(uri, hash + content, () =>
    "with($$contexts['"+hash+"']) {" +

      GLOBAL_FIX_SHIM +

      // guard from global context values from being overwritten.
      "(function(){" +

        // new line in case there's comment
        content + "\n" +
      "})();" +
    "}");
}


export function runModuleSandboxScript(script: vm.Script, hash: string, { global, vmContext }: Sandbox, context: any) {
  if (!global.$$contexts) global.$$contexts = {};
  global.$$contexts[hash] = context;
  script.runInContext(vmContext);
}


export function runGlobalSandboxScript(script: vm.Script, { global, vmContext }: Sandbox) {
  script.runInContext(vmContext);
}

export function compileGlobalSandboxScript(uri: string, hash: string, content: string): vm.Script {
  return compileSandboxScript(uri, hash + content, () => 
    GLOBAL_FIX_SHIM + content
  );
}