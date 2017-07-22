import { noop } from "lodash";
import { readAll } from "mesh";
import { LogLevel, loadAppAction } from "aerial-common2";
import { 
  createFile,
  initApplication, 
  createWorkspace, 
  createDirectory,
  createApplicationState, 
} from "./index";

window.onload = () => {
  readAll(initApplication(createApplicationState({
    currentWorkspace: createWorkspace({
      sourceFilesDirectory: createDirectory({
        name: "/",
        childNodes: [
          createFile({
            name: "index.html",
            childNodes: []
          }),
          createDirectory({
            name: "js",
            childNodes: [
              createFile({
                name: "main.js",
                childNodes: []
              })
            ]
          }),
          createDirectory({
            name: "css",
            childNodes: [
              createFile({
                name: "main.css",
                childNodes: []
              })
            ]
          })
        ]
      }),
      browser: undefined
    }),
    element: document.querySelector("#application") as HTMLElement,
    log: {
      level: LogLevel.VERBOSE
    }
  }))(noop)(loadAppAction()));
};