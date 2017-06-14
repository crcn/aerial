import { CoreEvent } from "aerial-common";

export class DependencyEvent extends CoreEvent {
  static readonly DEPENDENCY_LOADED = "dependencyReady";
}