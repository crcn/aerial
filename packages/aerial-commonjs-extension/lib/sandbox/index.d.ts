import { MimeTypeProvider } from "aerial-common";
import { SandboxModuleEvaluatorFactoryProvider } from "aerial-sandbox";
export declare const createJavaScriptSandboxProviders: () => (MimeTypeProvider | SandboxModuleEvaluatorFactoryProvider)[];
export * from "./commonjs-evaluator";
