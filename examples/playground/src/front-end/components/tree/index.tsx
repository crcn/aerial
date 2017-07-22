import "./index.scss";

import * as React from "react";
import { readAll } from "mesh";
import { 
  pure, 
  compose, 
  withState,
  defaultProps, 
  withHandlers, 
} from "recompose";
import { TreeNode, getTreeNodeDepth, Dispatcher, BaseEvent, wrapEventToDispatch } from "aerial-common2";

export const TREE_NODE_LABEL_CLICKED = "TREE_NODE_LABE_CLICKED";
export type TreeNodeLabelClickedEvent = {
  node: TreeNode<any>
} & BaseEvent;

export const treeNodeLabelClicked = (node: TreeNode<any>): TreeNodeLabelClickedEvent => ({ type: TREE_NODE_LABEL_CLICKED, node });

// TODO - move these over to aei
export type TreeNodeBaseProps = {
  getLabel: (node: TreeNode<any>) => string,
  collapsible?: (node: TreeNode<any>) => boolean,
  children?: any
};

export type TreeNodeProps = {
  dispatch: Dispatcher<any>,
  rootNode: TreeNode<any>,
  collapsed?: boolean,
  onLabelClick?: () => any,
  node: TreeNode<any>,
} & TreeNodeBaseProps;

export type TreeComponentProps = {
  dispatch: Dispatcher<any>,
  rootNode: TreeNode<any>
} & TreeNodeBaseProps;

const TreeNodeComponentBase = ({ rootNode, node, getLabel, collapsed, collapsible, onLabelClick, dispatch }: TreeNodeProps) => {
  const isCollapsible = collapsible(node);

 return <div className="tree-node">
    <div className="tree-node-label" onClick={onLabelClick} style={{
      cursor: "pointer",
      paddingLeft: (getTreeNodeDepth(node, rootNode) - 1) * 2
    }}>
      { getLabel(node) }
    </div>
    <div className="tree-node-children">
      {
        collapsed ? null : node.childNodes.map((child, i) => <TreeNodeComponent key={i} rootNode={rootNode} node={child} getLabel={getLabel} collapsible={collapsible} dispatch={dispatch} />)
      }
    </div>
  </div>
};


const TreeNodeComponent = compose(
  pure,
  withState("collapsed", "setCollapsed", () => false),
  withHandlers({
    onLabelClick: ({ dispatch, node, collapsed, collapsible, setCollapsed }) => () => {
      if (collapsible(node)) {
        setCollapsed(!collapsed);
      }
      if (dispatch) {
        readAll(dispatch(treeNodeLabelClicked(node)));
      }
    }
  })
)(TreeNodeComponentBase) as any as (props: TreeNodeProps) => React.Component<TreeNodeProps>;

export const TreeComponentBase = ({ rootNode, getLabel, collapsible, dispatch }: TreeNodeProps) => <div className="tree-component">
  {
    rootNode.childNodes.map((child, i) => <TreeNodeComponent key={i} rootNode={rootNode} node={child} getLabel={getLabel} collapsible={collapsible} dispatch={dispatch} />)
  }
</div>;

export const TreeComponent = compose(
  pure,
  defaultProps({
    collapsible: () => false
  })
)(TreeComponentBase) as any as (props: TreeComponentProps) => React.Component<TreeComponentProps>;