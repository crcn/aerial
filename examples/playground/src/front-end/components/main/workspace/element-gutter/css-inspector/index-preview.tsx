import "front-end/scss/index.scss";
import * as React from "react";
import { CSSICSSInspector } from "./index";
import { createWorkspace, createSyntheticWindow, createSyntheticDocument, createSyntheticElement, SYNTHETIC_ELEMENT } from "front-end/state";



export const Preview = () => {

  const window = createSyntheticWindow({
    document: createSyntheticDocument({
      childNodes: [
        createSyntheticElement({
          nodeName: "SPAN",
          attributes: [],
          childNodes: []
        })
      ]
    })
  });

  const workspace = createWorkspace({
    selectionRefs: [[SYNTHETIC_ELEMENT, "e1"]]
  });
  return <CSSICSSInspector window={window} workspace={workspace} />;
}