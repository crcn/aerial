import { Mutation } from "@tandem/common";

import { isDOMElementMutation } from "./element";
import { isDOMContainerMutation } from "./container";
import { isDOMValueNodeMutation } from "./value-node";
import { isDOMDocumentMutation } from "../document";

export function isDOMNodeMutation(mutation: Mutation<any>) {
  return  isDOMElementMutation(mutation) || isDOMContainerMutation(mutation) || isDOMValueNodeMutation(mutation) || isDOMDocumentMutation(mutation);
}