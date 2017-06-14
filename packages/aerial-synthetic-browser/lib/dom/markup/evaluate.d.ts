import { SandboxModule } from "aerial-sandbox";
import { SyntheticDocument } from "../document";
import { SyntheticDOMContainer } from "./container";
import parse5 = require("parse5");
export declare function evaluateMarkup(expression: parse5.AST.Default.Node, doc: SyntheticDocument, namespaceURI?: string, module?: SandboxModule, parentContainer?: SyntheticDOMContainer): any;
