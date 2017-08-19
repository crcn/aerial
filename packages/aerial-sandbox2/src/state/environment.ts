import { Struct, createStructFactory } from "aerial-common2";

export const SANDBOX_ENVIRONMENT = "SANDBOX_ENVIRONMENT";
export const SANDBOX = "SANDBOX";

export type SandboxEnvironment = {
  entryHash: string;
  exports?: any;
  fresh: boolean;
} & Struct;

export type Sandbox = {
  environments: SandboxEnvironment[]
} & Struct;

export const createSandbox = createStructFactory<Sandbox>(SANDBOX, {
  environments: []
});

export const createSandboxEnvironment = createStructFactory<SandboxEnvironment>(SANDBOX_ENVIRONMENT, {
  fresh: false
});

export const getSandbox = (root: any): Sandbox => null; //getValuesByType(root, SANDBOX)[0];
export const getSandboxEnvironment = (root: any, sandboxEnvironmentId: string): SandboxEnvironment => null; //getValueById(root, sandboxEnvironmentId);