import {
 SandboxModule,
 ISandboxDependencyEvaluator,
} from "aerial-sandbox";

import { evaluateCSS, parseCSS, evaluateCSSSource } from "..";

export class CSSDependencyEvaluator implements ISandboxDependencyEvaluator {
  evaluate(module: SandboxModule) {
    module.exports = evaluateCSSSource(module.source.content, module.source.map, module);
  }
}