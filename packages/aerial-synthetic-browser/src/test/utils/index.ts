import parse5 = require("parse5");
import { sample, sampleSize, random, omit } from "lodash";
import { ImmutableObject } from "aerial-common2";
import { createJavaScriptSandboxProviders } from "aerial-commonjs-extension";
import { ISandboxTestProviderOptions, createTestSandboxProviders } from "aerial-sandbox/test";
import { 
  Kernel, 
  LogLevel, 
  BrokerBus, 
  KernelProvider, 
  HTML_MIME_TYPE,
  PrivateBusProvider, 
} from "aerial-common";

import { 
  IFileResolver, 
  FileCacheProvider,
  createSandboxProviders, 
  DependencyGraphProvider,
  ProtocolURLResolverProvider,
  ContentEditorFactoryProvider, 
} from "aerial-sandbox";

import {
  parseCSS,
  evaluateCSS,
  evaluateMarkup,
  SyntheticWindow,
  SyntheticDOMText,
  SyntheticBrowser,
  SyntheticDocument,
  SyntheticDOMComment,
  SyntheticDOMElement,
  SyntheticDOMContainer,
  SyntheticCSSStyleSheet,
  createSyntheticHTMLProviders,
} from "../..";

export function createMockBrowser() {
  const deps = createSandboxProviders();
  return new SyntheticBrowser(new Kernel(deps));
}

const CHARS = "abcdefghijkl".split("");

function generateRandomText(maxLength: number = 5) {
  return sampleSize(CHARS, random(1, maxLength)).join("");
}

function generateRandomChar() {
  return sample(CHARS);
}

export function generateRandomSyntheticHTMLElementSource(maxChildCount: number = 10, maxDepth: number = 10, maxAttributes: number = 10) {

  function createRandomSyntheticFragment() {

    const fragment = [];

    if (maxDepth)
    for (let i = random(0, maxChildCount); i--;) {
      fragment.push(generateRandomSyntheticHTMLElementSource(maxChildCount, random(0, maxDepth - 1), maxAttributes));
    }

    return fragment.join("");
  }


  function createRandomElement() {
    const tagName = generateRandomChar();
    let element = ["<", tagName];
    const attribs = {};

    for (let i = random(0, Math.min(maxAttributes, CHARS.length - 1)); i--;) {
      let key;
      while(attribs[key = generateRandomChar()]);
      attribs[key] = 1;
      element.push(" ", key, '="', generateRandomText(), '"');
    }

    element.push(">", createRandomSyntheticFragment(), "</" + tagName + ">");

    return element.join("");
  }

  function createRandomTextNode() {
    return generateRandomText();
  }

  function createRandomComment() {
      return `<!--${generateRandomText()}-->`;
  }

  return maxDepth ? createRandomElement() : sample([createRandomElement, createRandomTextNode, createRandomComment])();
}

export function generateRandomSyntheticHTMLElement(document: SyntheticDocument, maxChildCount: number = 10, maxDepth: number = 10, maxAttributes: number = 10, generateShadow: boolean = false) {
  return evaluateMarkup(parse5.parse(generateRandomSyntheticHTMLElementSource(maxChildCount, maxDepth, maxAttributes), { locationInfo: true }) as any, document);
}

export function generateRandomStyleSheet(maxRules: number = 100, maxDeclarations: number = 20): SyntheticCSSStyleSheet {

  function createKeyFrameRule() {
    return `@keyframes ${generateRandomChar()} {
      ${
        Array.from({ length: random(1, maxRules) }).map((v) => {
          return createStyleRule();
        }).join("\n")
      }
    }`
  }
  function createStyleRule() {
    return `.${generateRandomChar()} {
      ${
        Array.from({ length: random(1, maxDeclarations) }).map((v) => {
          return `${generateRandomChar()}: ${generateRandomText(2)};`;
        }).join("\n")
      }
    }`
  }
  function createMediaRule() {
    return `@media ${generateRandomChar()} {
      ${
        Array.from({ length: random(1, maxRules) }).map((v) => {
          return sample([createStyleRule, createKeyFrameRule])();
        }).join("\n")
      }
    }`;
  }

  const randomStyleSheet = Array
  .from({ length: random(1, maxRules) })
  .map(v => sample([createStyleRule, createMediaRule, createKeyFrameRule])()).join("\n");


  return evaluateCSS(parseCSS(randomStyleSheet));
}

export const timeout = (ms = 10) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const omit$$idDeep = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(omit$$idDeep);
  } else if (obj && obj.constructor === Object || obj.constructor === ImmutableObject) {
    const clone = {};
    for (const k in obj) {
      if (k === "$$id") continue;
      clone[k] = omit$$idDeep(obj[k]);
    }
    return clone;
  }
  return obj;
}

interface ITestKernelOptions {
  log?: {
    level: LogLevel
  },
  sandboxOptions?: ISandboxTestProviderOptions,
  createTestProviders?: () => any
}

export const createRandomFileName = (extension) => Math.round(Math.random() * 9999999999) + "." + extension;


export const createTestKernel = (options: ITestKernelOptions = {}) => {
  const bus = new BrokerBus();
  const kernel = new Kernel(
    new KernelProvider(),
    createTestSandboxProviders(options.sandboxOptions),
    new PrivateBusProvider(bus),
    createSyntheticHTMLProviders(),
    createJavaScriptSandboxProviders(),
  );

  if (options.createTestProviders) {
    kernel.register(options.createTestProviders());
  }
  FileCacheProvider.getInstance(kernel).syncWithLocalFiles();
  return kernel;
};

export const loadTestBrowser = async (mockFiles: any, entryFilePath: string) => {
  const kernel = createTestKernel({
    log: {
      level: LogLevel.VERBOSE
    },
    sandboxOptions: {
      mockFiles: mockFiles
    }
  });

  const browser = new SyntheticBrowser(kernel);

  await browser.open({
    uri: entryFilePath
  });

  return browser;
}