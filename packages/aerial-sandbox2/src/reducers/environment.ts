import { BaseEvent, updateStruct, updateStructProperty } from "aerial-common2";
import { ADD_SANDBOX_ENVIRONMENT, SANDBOX_ENVIRONMENT_CREATED, AddSandboxEnvironmentRequest, SandboxEnvironmentCreatedEvent, DEPENDENCY_CONTENT_LOADED, DependencyContentLoadedEvent, SANDBOX_ENVIRONMENT_EVALUATED, SandboxEnvironmentEvaluatedEvent } from "../actions";
import { createSandbox, getSandbox, getSandboxEnvironment, createSandboxEnvironment, getDependency, getAllDependencyHashes, getAllDependencies, dependencyTreeContainsHash } from "../state";

export const sandboxReducer = (root: any = createSandbox(), event: BaseEvent) => {
  switch(event.type) {
    case SANDBOX_ENVIRONMENT_CREATED: {
      const { entryHash } = event as SandboxEnvironmentCreatedEvent;
      const sandbox = getSandbox(root);

      return updateStructProperty(root, sandbox, "environments", [
        ...sandbox.environments,
        createSandboxEnvironment({ entryHash })
      ]);
    }
    case DEPENDENCY_CONTENT_LOADED: {
      const { dependencyId } = event as DependencyContentLoadedEvent;
      const dependency = getDependency(root, dependencyId);
      const sandbox = getSandbox(root);
      for (const environment of sandbox.environments) {
        if (!environment.fresh) {
          if (dependencyTreeContainsHash(root, environment.entryHash, dependency.hash)) {
            root = updateStruct(root, environment, {
              fresh: true
            });
          }
        }
      }
      break;
    }

    case SANDBOX_ENVIRONMENT_EVALUATED: {
      const { sandboxEnvironmentId, exports } = event as SandboxEnvironmentEvaluatedEvent;
      return updateStruct(root, getSandboxEnvironment(root, sandboxEnvironmentId), {
        fresh: true,
        exports
      });
    }
  }
  return root;
};  