import { Request, BaseEvent, generateDefaultId } from "aerial-common2";
import { Dependency } from "../state";

export const ADD_SANDBOX_ENVIRONMENT     = "ADD_SANDBOX_ENVIRONMENT";
export const SANDBOX_ENVIRONMENT_CREATED = "SANDBOX_ENVIRONMENT_CREATED";
export const EVALUATE_DEPENDENCY         = "EVALUATE_DEPENDENCY";
export const SANDBOX_ENVIRONMENT_EVALUATED = "SANDBOX_ENVIRONMENT_EVALUATED";

export type AddSandboxEnvironmentRequest = {
  uri: string
} & Request;

export type SandboxEnvironmentCreatedEvent = {
  entryHash: string;
} & BaseEvent;

export type SandboxEnvironmentEvaluatedEvent = {
  sandboxEnvironmentId: string;
  exports: any;
} & BaseEvent;

export type EvaluateDependencyRequest = {
  entryHash: string;
} & Request;

export const createAddSandboxEnvironmentRequest = (uri: string): AddSandboxEnvironmentRequest => ({
  uri,
  type: ADD_SANDBOX_ENVIRONMENT,
  $$id: generateDefaultId()
});

export const createSandboxEnvironmentCreatedEvent = (entryHash: string): SandboxEnvironmentCreatedEvent => ({
  entryHash,
  type: SANDBOX_ENVIRONMENT_CREATED
});

export const createSandboxEnvironmentEvaluatedEvent = (sandboxEnvironmentId: string, _exports: any): SandboxEnvironmentEvaluatedEvent => ({
  exports: _exports,
  sandboxEnvironmentId,
  type: SANDBOX_ENVIRONMENT_EVALUATED,
});
