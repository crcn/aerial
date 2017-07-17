import "./index.scss";
import * as React from "react";
import { compose, pure } from "recompose";
import { TreeComponent } from "../../tree";
import { PaneComponent } from "../../pane";
import { immutable, TreeNode } from "aerial-common2";

type FsItem = TreeNode<{
  basename: string,
  type: string
}>;

type Directory = FsItem
type File = FsItem;


const TEST_FILES: Directory = {
  basename: "",
  childNodes: [
    {
      basename: "html",
      type: "directory",
      childNodes: [
        {
          basename: "index.html",
          childNodes: []
        }
      ]
    },
    {
      basename: "css",
      childNodes: [
        {
          basename: "index.css",
          childNodes: []
        },
        {
          basename: "index2.css",
          childNodes: []
        }
      ]
    }
  ]
};

const getFileLabel = (node: File) => `/${node.basename}`;
const collapsible = (node: FsItem) => node.type === "directory";

const enhanceFileNavigator = compose(
  pure
);

export const FileNavigatorComponentBase = () => <div className="file-navigator-component">
  <PaneComponent title="Files">
    <TreeComponent rootNode={TEST_FILES} getLabel={getFileLabel} collapsible={collapsible} />
  </PaneComponent>
</div>;

export const FileNavigatorComponent = enhanceFileNavigator(FileNavigatorComponentBase);