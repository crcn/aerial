import { noop } from "lodash";
import { readAll } from "mesh";
import { LogLevel, loadAppAction } from "aerial-common2";
import { Kernel } from "aerial-common";
import { 
  createFile,
  initApplication, 
  createWorkspace, 
  createDirectory,
  createApplicationState, 
} from "./index";

const HTML_CONTENT = 
`
<html>
  <head>
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

const workspace = createWorkspace({
  sourceFilesDirectory: createDirectory({
    name: "/",
    childNodes: [
      createFile({
        name: "index.html",
        content: HTML_CONTENT,
        childNodes: []
      }),
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
  }),
  browser: undefined
});

const kernel = new Kernel(

);

window.onload = () => {
  readAll(initApplication(createApplicationState({
    kernel: kernel,
    workspaces: [workspace],
    selectedWorkspaceId: workspace.$$id,
    element: document.querySelector("#application") as HTMLElement,
    log: {
      level: LogLevel.VERBOSE
    }
  }))(noop)(loadAppAction()));
};