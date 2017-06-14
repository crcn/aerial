import { Dependency } from "./dependency";
import { TreeWalker } from "aerial-common";
export declare class DependencyWalker extends TreeWalker {
    private _walked;
    constructor(each: (dependency: Dependency) => any);
    accept(dependency: Dependency): void;
}
export declare function flattenDependencies(root: Dependency): Dependency[];
