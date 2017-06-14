import { ISandboxDependencyEvaluator, sandboxDependencyEvaluatorType } from "./index";
import { ClassFactoryProvider, Kernel } from "aerial-common";
export declare class SandboxModuleEvaluatorFactoryProvider extends ClassFactoryProvider {
    readonly mimeType: string;
    static readonly ID: string;
    constructor(mimeType: string, clazz: sandboxDependencyEvaluatorType);
    clone(): SandboxModuleEvaluatorFactoryProvider;
    static getNamespace(mimeType: string): string;
    create(): ISandboxDependencyEvaluator;
    static find(mimeType: string, kernel: Kernel): SandboxModuleEvaluatorFactoryProvider;
}
