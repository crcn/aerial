/// <reference types="node" />
import vm = require("vm");
import { Sandbox } from "./index";
export declare function compileModuleSandboxScript(uri: string, hash: string, content: string): vm.Script;
export declare function runModuleSandboxScript(script: vm.Script, hash: string, {global, vmContext}: Sandbox, context: any): void;
export declare function runGlobalSandboxScript(script: vm.Script, {global, vmContext}: Sandbox): void;
export declare function compileGlobalSandboxScript(uri: string, hash: string, content: string): vm.Script;
