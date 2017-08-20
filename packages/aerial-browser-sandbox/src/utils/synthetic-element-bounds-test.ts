import { expect } from "chai";
import { Bounds, createBounds, traverseObject } from "aerial-common2";
import { createSyntheticTextNode, createSyntheticElement, createSyntheticWindow, createSyntheticDocument, getSyntheticNodeById, SyntheticElement } from "../state";
import { convertAbsoluteBoundsToRelative } from "./synthetic-element-bounds";

describe(__filename + "#", () => {
  const createSquareBounds = (left, top) => createBounds(left, left + 100, top, top + 100);

  const SYNTHETIC_WINDOW_FIXTURE_1 = createSyntheticWindow({
    box: createBounds(0, 0, 1366, 768),
    allComputedBounds: {
      n1: createBounds(0, 0, 1366, 768),
      n2: createBounds(0, 0, 1366, 768),
      n21: createSquareBounds(500, 500),
      n211: createSquareBounds(500, 500),
      n212: createSquareBounds(500, 500),
    },
    allComputedStyles: {
      n2: {
        position: "relative",
        left: "0px",
        top: "0px",
        width: "1366px",
        height: "768px"
      },
      n21: {
        position: "relative",
        left: "500px",
        top: "500px",
        width: "600px",
        height: "600px",
        paddingLeft: "0px",
        paddingTop: "0px",
      },
      n211: {
        position: "relative",
        left: "0px",
        top: "0px",
        width: "100px",
        height: "100px"
      },
      n212: {
        position: "fixed",
        left: "500px",
        top: "500px",
        width: "100px",
        height: "100px"
      }
    },
    document: createSyntheticDocument({
      title: "document 1",
      childNodes: createSyntheticElement({
        $$id: "n1",
        nodeName: "html",
        attributes: {},
        childNodes: [
          createSyntheticElement({
            nodeName: "head",
            attributes: {},
            childNodes: []
          }),
          createSyntheticElement({
            $$id: "n2",
            parentId: "n1",
            nodeName: "body",
            attributes: {},
            childNodes: [
              createSyntheticElement({
                $$id: "n21",
                parentId: "n2",
                attributes: {},
                nodeName: "box",
                childNodes: [
                  createSyntheticElement({
                    $$id: "n211",
                    parentId: "n21",
                    attributes: {},
                    nodeName: "box",
                    childNodes: []
                  }),
                  createSyntheticElement({
                    $$id: "n212",
                    parentId: "n21",
                    attributes: {},
                    nodeName: "box",
                    childNodes: []
                  })
                ]
              })
            ]
          })
        ]
      })
    })
  });

  const allNodes = {};

  traverseObject(SYNTHETIC_WINDOW_FIXTURE_1, (node) => {
    if (node && node.constructor === Object && node.nodeType != null) {
      allNodes[node.$$id] = node;
    }
  })

  SYNTHETIC_WINDOW_FIXTURE_1.allNodes = allNodes;

  describe("convertAbsoluteBoundsToRelative#", () => {
    [
      ["n21", createSquareBounds(600, 600), createSquareBounds(600, 600)],
      ["n211", createSquareBounds(600, 600), createSquareBounds(100, 100)],
      ["n212", createSquareBounds(600, 600), createSquareBounds(600, 600)]
    ].forEach(([id, absoluteBounds, relativeBounds]: [string, Bounds, Bounds]) => {
      it(`for fixture n2, converts absolute boudns of ${JSON.stringify(absoluteBounds)} to ${JSON.stringify(relativeBounds)}`, () => {
        expect(convertAbsoluteBoundsToRelative(absoluteBounds, SYNTHETIC_WINDOW_FIXTURE_1.allNodes[id] as SyntheticElement, SYNTHETIC_WINDOW_FIXTURE_1)).to.eql(relativeBounds);
      });
    }); 
  });
});