import "./index.scss";

import * as React from "react";
import { TreeNode, getTreeNodeDepth } from "aerial-common2";
import { 
  pure, 
  compose, 
  withState,
  defaultProps, 
  withHandlers, 
} from "recompose";

// TODO - move these over to aei
export type TreeNodeBaseProps = {
  getLabel: (node: TreeNode<{}>) => string,
  collapsible?: (node: TreeNode<{}>) => boolean,
  children?: any
};

export type TreeNodeProps = {
  rootNode: TreeNode<{}>,
  collapsed?: boolean,
  onLabelClick?: () => any,
  node: TreeNode<{}>,
} & TreeNodeBaseProps;

export type TreeComponentProps = {
  rootNode: TreeNode<{}>
} & TreeNodeBaseProps;

const TreeNodeComponentBase = ({ rootNode, node, getLabel, collapsed, collapsible, onLabelClick }: TreeNodeProps) => {
  const isCollapsible = collapsible(node);

 return <div className="tree-node">
    <div className="tree-node-label" onClick={onLabelClick} style={{
      cursor: isCollapsible ? "pointer" : "default",
      paddingLeft: (getTreeNodeDepth(node, rootNode) - 1) * 2
    }}>
      { getLabel(node) }
    </div>
    <div className="tree-node-children">
      {
        collapsed ? null : node.childNodes.map((child, i) => <TreeNodeComponent key={i} rootNode={rootNode} node={child} getLabel={getLabel} collapsible={collapsible} />)
      }
    </div>
  </div>
};

const TreeNodeComponent = compose(
  pure,
  withState("collapsed", "setCollapsed", () => false),
  withHandlers({
    onLabelClick: ({ node, collapsed, collapsible, setCollapsed }) => () => {
      collapsible(node) && setCollapsed(!collapsed);
    }
  })
)(TreeNodeComponentBase) as any as (props: TreeNodeProps) => React.Component<TreeNodeProps>;

export const TreeComponentBase = ({ rootNode, getLabel, collapsible }: TreeNodeProps) => <div className="tree-component">
  {
    rootNode.childNodes.map((child, i) => <TreeNodeComponent key={i} rootNode={rootNode} node={child} getLabel={getLabel} collapsible={collapsible} />)
  }
</div>;

export const TreeComponent = compose(
  pure,
  defaultProps({
    collapsible: () => false
  })
)(TreeComponentBase) as any as (props: TreeComponentProps) => React.Component<TreeComponentProps>;