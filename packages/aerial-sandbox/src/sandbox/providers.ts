import { ISandboxDependencyEvaluator, sandboxDependencyEvaluatorType } from "./index";
import { ClassFactoryProvider, Kernel } from "aerial-common";

export class SandboxModuleEvaluatorFactoryProvider extends ClassFactoryProvider {
  static readonly ID = "sandboxModuleEvaluator";
  constructor(readonly mimeType: string, clazz: sandboxDependencyEvaluatorType) {
    super(SandboxModuleEvaluatorFactoryProvider.getNamespace(mimeType), clazz);
  }

  clone() {
    return new SandboxModuleEvaluatorFactoryProvider(this.mimeType, this.value);
  }

  static getNamespace(mimeType: string) {
    return [this.ID, mimeType].join("/");
  }

  create(): ISandboxDependencyEvaluator {
    return super.create();
  }

  static find(mimeType: string, kernel: Kernel) {
    return kernel.query<SandboxModuleEvaluatorFactoryProvider>(this.getNamespace(mimeType));
  }
}