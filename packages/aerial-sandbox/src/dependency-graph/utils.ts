import { Dependency } from "./dependency";
import { TreeWalker } from "aerial-common";
import { IResolvedDependencyInfo } from "./strategies";

export class DependencyWalker extends TreeWalker {
  private _walked: any;

  constructor(each: (dependency: Dependency) => any) {
    super(each);
    this._walked = {};
  }

  accept(dependency: Dependency) {
    if (this._walked[dependency.hash]) return;
    this._walked[dependency.hash] = true;
    super.accept(dependency);
  }
}

export function flattenDependencies(root: Dependency): Dependency[] {
  const deps = [];
  new DependencyWalker((dependency: Dependency) => {
    deps.push(dependency);
  }).accept(root);
  return deps;
}
