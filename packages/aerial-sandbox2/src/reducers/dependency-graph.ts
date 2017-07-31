import { BaseEvent } from "aerial-common2";
import { DependencyGraph, createDependencyGraph } from "../state";

export const dependencyGraphReducer = (state: DependencyGraph = createDependencyGraph(), event: BaseEvent) => {
  return state;
};