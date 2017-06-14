import vm =  require("vm");
import path =  require("path");
import { ISandboxDependencyEvaluator, SandboxModule, compileModuleSandboxScript, runModuleSandboxScript } from "aerial-sandbox";

export class CommonJSSandboxEvaluator implements ISandboxDependencyEvaluator {
  evaluate(module: SandboxModule) {
    const { source, sandbox } = module;
    const { content, hash } = source;
    const { global, vmContext } = sandbox;

    const script = compileModuleSandboxScript(module.uri, hash, content);

    const resolve = (url) => {
      return source.eagerGetDependency(url);
    };

    const require = (relativePath) => {
      const dep = resolve(relativePath);

      // DEP may not exist, especially if loaded by a NULL loader.
      return dep && sandbox.evaluate(dep);
    }

    (require as any).resolve = resolve;
    const context = source.graph.createModuleContext(module);
    Object.assign(context, { global, require });
    runModuleSandboxScript(script, hash, sandbox, context);
  }
}