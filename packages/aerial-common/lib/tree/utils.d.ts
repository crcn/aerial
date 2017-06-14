import { ITreeNode } from "./core";
import { IWalkable } from "./walker";
export declare function traverseTree<T extends IWalkable>(node: T, each: (node: T) => any): void;
export declare function filterTree<T extends IWalkable>(node: T, filter: (node: T) => boolean): T[];
export declare function flattenTree<T extends IWalkable>(node: T): T[];
export declare function findTreeNode<T extends IWalkable>(node: T, filter: (node: any) => boolean): T;
export declare function getTreeAncestors<T extends ITreeNode<any>>(node: T): T[];
export declare function getNextTreeSiblings<T extends ITreeNode<any>>(node: T): T[];
export declare function getPreviousTreeSiblings<T extends ITreeNode<any>>(node: T): T[];
