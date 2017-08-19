// https://github.com/tandemcode/tandem/blob/master/src/%40tandem/editor/browser/components/pages/workspace/mid/center/canvas/index.tsx#L270

import "./index.scss";
import * as React from "react";
import { Workspace } from "front-end/state";
import { ToolsLayerComponent } from "./tools";
import { WindowsComponent } from "./windows";
import { IsolateComponent } from "front-end/components/isolated";
import { Dispatcher, BaseEvent, Point } from "aerial-common2";
import { lifecycle, compose, withState, withHandlers, pure, Component } from "recompose";
import { stageWheel } from "front-end/actions";
import { SyntheticBrowser } from "aerial-browser-sandbox";

const PANE_SENSITIVITY = process.platform === "win32" ? 0.1 : 1;
const ZOOM_SENSITIVITY = process.platform === "win32" ? 2500 : 250;

export type StageOuterComponentProps = {
  workspace: Workspace;
  browser: SyntheticBrowser;
  dispatch: Dispatcher<any>;
};

export type StageInnerComponentProps = {
  canvasOuter: HTMLElement;
  onWheel: (event: React.SyntheticEvent<MouseEvent>) => any;
  mousePosition: Point;
  onDrop: (event: React.SyntheticEvent<any>) => any;
  onMouseEvent: (event: React.SyntheticEvent<any>) => any;
  onMouseDown: (event: React.SyntheticEvent<any>) => any;
  onDragEnter: (event: React.SyntheticEvent<any>) => any;
  onDragExit: (event: React.SyntheticEvent<any>) => any;
  setCanvasOuter: (element: HTMLElement) => any;
} & StageOuterComponentProps;

const enhanceStageComponent = compose<StageOuterComponentProps, StageInnerComponentProps>(
  pure,
  withState('canvasOuter', 'setCanvasOuter', null),
  withState('mousePosition', 'setMousePosition', null),
  withHandlers({
    onMouseEvent: ({ setMousePosition }) => (event: React.MouseEvent<any>) => {
      setMousePosition({ left: event.pageX, top: event.pageY });
    },
    onWheel: ({ workspace, dispatch, canvasOuter, mousePosition }: StageInnerComponentProps) => (event: React.WheelEvent<any>) => {
      const rect = canvasOuter.getBoundingClientRect();
      event.preventDefault();
      dispatch(stageWheel(workspace.$$id, rect.width, rect.height, mousePosition, event));
    }
  })
);

export const StageComponentBase = ({ 
  setCanvasOuter,
  workspace, 
  browser,
  dispatch, 
  onWheel,
  onDrop,
  onMouseEvent,
  onDragEnter,
  onMouseDown,
  onDragExit
}: StageInnerComponentProps) => {
  if (!workspace) return null;

  const { translate, cursor } = workspace.stage;

  const outerStyle = {
    cursor: cursor || "default"
  }

  const innerStyle = {
    transform: `translate(${translate.left}px, ${translate.top}px) scale(${translate.zoom})`
  };

  return <div className="stage-component">
    <IsolateComponent 
    inheritCSS 
    ignoreInputEvents
    className="stage-component-isolate"
    onWheel={onWheel} 
    scrolling={false} 
    translateMousePositions={false}
    >
      <span>
        <style>
          {
            `html, body {
              overflow: hidden;
            }`
          }
        </style>
        <div
          ref={setCanvasOuter}
          onMouseMove={onMouseEvent}
          onDragOver={onDragEnter}
          onDrop={onDrop}
          onMouseDown={onMouseDown}
          tabIndex={-1}
          onDragExit={onDragExit}
          className="stage-inner"
          style={outerStyle}>
          <div style={innerStyle} className="stage-inner">
            <WindowsComponent browser={browser} dispatch={dispatch} />
            <ToolsLayerComponent workspace={workspace} dispatch={dispatch} browser={browser} />
          </div>
        </div>
      </span>
    </IsolateComponent>
  </div>;
}


export const StageComponent = enhanceStageComponent(StageComponentBase as any) as any as Component<StageOuterComponentProps>;

export * from "./tools";
