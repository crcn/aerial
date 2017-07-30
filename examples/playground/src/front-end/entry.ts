import { noop } from "lodash";
import { Kernel } from "aerial-common";
import { LogLevel } from "aerial-common2";
import { createSyntheticBrowser2 } from "aerial-synthetic-browser";

import { 
  createFile,
  initApplication, 
  createWorkspace, 
  createDirectory,
  createApplicationState, 
} from "./index";

const WORKSPACE_CONTENT = 
`
HELLO CONTENT
`

const HTML_CONTENT = 
`
<html>
  <head>
    <title>Test document</title>
  </head>
  <body>
    <div id="application">
      Hello
    </div>
  </body>
</html>
`.trim();

const JS_CONTENT = 
`
document.getElementById("application").innerHTML = "HELLO";
`.trim();

const CSS_CONTENT = 
`
html, body {
  margin: 0;
  padding: 0;
}
`.trim();

const mainFile = createFile({
  name: "workspace.html",
  content: WORKSPACE_CONTENT,
  childNodes: []
});

const indexFile = createFile({
  name: "index.html",
  content: HTML_CONTENT,
  childNodes: []
});

const publicDirectory = createDirectory({
  name: "public",
  childNodes: [
    indexFile,
    createDirectory({
      name: "js",
      childNodes: [
        createFile({
          name: "main.js",
          content: JS_CONTENT,
          childNodes: []
        })
      ]
    }),
    createDirectory({
      name: "css",
      childNodes: [
        createFile({
          name: "main.css",
          content: CSS_CONTENT,
          childNodes: []
        })
      ]
    })
  ]
});

const sourceFiles = createDirectory({
  name: "root",
  childNodes: [
    mainFile,
    publicDirectory
  ]
});

const workspace = createWorkspace({
  sourceFiles: sourceFiles,
  publicDirectoryId: publicDirectory.$$id,
  browser: createSyntheticBrowser2(),
  mainFileId: indexFile.$$id,
});

initApplication(createApplicationState({
  workspaces: [workspace],
  selectedWorkspaceId: workspace.$$id,
  element: typeof document !== "undefined" ? document.querySelector("#application") as HTMLElement : undefined,
  log: {
    level: LogLevel.VERBOSE
  }
}));