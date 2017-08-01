import { BaseEvent, updateStructProperty, updateStruct } from "aerial-common2";

import { 
  AddDependencyRequest, 
  DEPENDENCY_CREATED, 
  DependencyCreatedEvent, 
  DEPENDENCY_CONTENT_LOADED, 
  DependencyContentLoadedEvent, 
  DEPENDENCY_CHILDREN_ADDED,
  DependencyChildrenAddedEvent,
} from "../actions";

import { 
  DependencyGraph, 
  createDependencyGraph, 
  createDependency, 
  getDependencyGraph, 
  getDependency, 
  DependencyStatus 
} from "../state";

export const dependencyGraphReducer = (root: any, event: BaseEvent) => {
  switch(event.type) {

    case DEPENDENCY_CREATED: {
      const { info } = event as DependencyCreatedEvent;
      const graph = getDependencyGraph(root);
      if (graph.allDependencies[info.hash]) return root;
      return updateStructProperty(root, graph, "allDependencies", {
        ...graph.allDependencies,
        [info.hash]: createDependency(info)
      });
    }

    case DEPENDENCY_CONTENT_LOADED: {
      const { dependencyId, result } = event as DependencyContentLoadedEvent;
      const dependency = getDependency(root, dependencyId);
      return updateStruct(root, dependency, {
        importedDependencyIds: result.importedDependencyUris,
        content: result.content,
        contentType: result.contentType,
        status: DependencyStatus.CONTENT_LOADED
      });
    }

    case DEPENDENCY_CHILDREN_ADDED: {
      const { dependencyId, importedDependencyHashes } = event as DependencyChildrenAddedEvent;
      const dependency = getDependency(root, dependencyId);
      return updateStruct(root, dependency, {
        importedDependencyHashes: [...importedDependencyHashes],
        status: DependencyStatus.READY
      });
    }
  }
  return root;
};