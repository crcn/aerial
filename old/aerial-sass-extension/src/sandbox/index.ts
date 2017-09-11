import postcssSassSyntax = require("postcss-scss");

import { SCSSEditor } from "./scss-editor";
import { SASS_MIME_TYPE } from "../constants";
import { MimeTypeProvider, JS_MIME_TYPE, CSS_MIME_TYPE, HTML_MIME_TYPE } from "aerial-common";
// import { DependencyLoaderFactoryProvider, ContentEditorFactoryProvider } from "aerial-sandbox";

export const createSASSSandboxProviders = () => {
  return [

    // deprecated for now since node-sass is an pain to get implemented with electron
    // new ContentEditorFactoryProvider(SASS_MIME_TYPE, SCSSEditor),
    new MimeTypeProvider("scss", SASS_MIME_TYPE)
  ];
};
