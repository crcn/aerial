import {
 SandboxModule,
 ISandboxDependencyEvaluator,
} from "@tandem/sandbox";

import {
  evaluateMarkup,
  SyntheticWindow,
} from "../dom";

import { MarkupMimeTypeXMLNSProvider } from "../providers";

import parse5 = require("parse5");

export class HTMLDependencyEvaluator implements ISandboxDependencyEvaluator {
  evaluate(module: SandboxModule) {

    const window = <SyntheticWindow>module.sandbox.global;

    window.document.removeAllChildren();

    
    // documentElement must be this -- handled by browser instance. Also note
    // that we're not manually setting document element here to ensure that HTMLDependencyEvaluator works for imported docs
    // which is (slowly) being implemented in real browsers.
    evaluateMarkup(parse5.parse(module.source.content, { locationInfo: true }) as any, window.document, MarkupMimeTypeXMLNSProvider.lookup(module.source.uri, window.browser.kernel), module, window.document);
  }
}