// https://github.com/tandemcode/tandem/blob/master/src/%40tandem/editor/browser/components/pages/workspace/mid/center/canvas/index.tsx#L270

import "./index.scss";
import * as React from "react";
import { Workspace } from "front-end/state";
import { ToolsLayer } from "./tools";
import { Windows } from "./windows";
import { Isolate } from "front-end/components/isolated";
import { Dispatcher, BaseEvent, Point } from "aerial-common2";
import { lifecycle, compose, withState, withHandlers, pure } from "recompose";
import { SyntheticBrowser } from "aerial-browser-sandbox";
import { stageWheel, stageContainerMounted } from "front-end/actions";

const PANE_SENSITIVITY = process.platform === "win32" ? 0.1 : 1;
const ZOOM_SENSITIVITY = process.platform === "win32" ? 2500 : 250;

export type StageOuterProps = {
  workspace: Workspace;
  browser: SyntheticBrowser;
  dispatch: Dispatcher<any>;
};

export type StageInnerProps = {
  canvasOuter: HTMLElement;
  onWheel: (event: React.SyntheticEvent<MouseEvent>) => any;
  mousePosition: Point;
  setStageContainer(element: HTMLElement);
  onDrop: (event: React.SyntheticEvent<any>) => any;
  onMouseEvent: (event: React.SyntheticEvent<any>) => any;
  onMouseDown: (event: React.SyntheticEvent<any>) => any;
  onDragEnter: (event: React.SyntheticEvent<any>) => any;
  onDragExit: (event: React.SyntheticEvent<any>) => any;
  setCanvasOuter: (element: HTMLElement) => any;
} & StageOuterProps;

const enhanceStage = compose<StageInnerProps, StageOuterProps>(
  pure,
  withState('canvasOuter', 'setCanvasOuter', null),
  withState('mousePosition', 'setMousePosition', null),
  withHandlers({
    onMouseEvent: ({ setMousePosition }) => (event: React.MouseEvent<any>) => {
      setMousePosition({ left: event.pageX, top: event.pageY });
    },
    setStageContainer: ({ dispatch }) => (element: HTMLDivElement) => {
      dispatch(stageContainerMounted(element));
    },
    onWheel: ({ workspace, dispatch, canvasOuter, mousePosition }: StageInnerProps) => (event: React.WheelEvent<any>) => {
      const rect = canvasOuter.getBoundingClientRect();
      event.preventDefault();
      dispatch(stageWheel(workspace.$id, rect.width, rect.height, mousePosition, event));
    }
  })
);

export const StageBase = ({ 
  setCanvasOuter,
  setStageContainer,
  workspace, 
  browser,
  dispatch, 
  onWheel,
  onDrop,
  onMouseEvent,
  onDragEnter,
  onMouseDown,
  onDragExit
}: StageInnerProps) => {
  if (!workspace) return null;

  const { translate, cursor } = workspace.stage;

  const outerStyle = {
    cursor: cursor || "default"
  }

  const innerStyle = {
    transform: `translate(${translate.left}px, ${translate.top}px) scale(${translate.zoom})`
  };

  return <div className="stage-component" ref={setStageContainer}>
    <Isolate 
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
            <Windows browser={browser} dispatch={dispatch} />
            <ToolsLayer workspace={workspace} dispatch={dispatch} browser={browser} />
          </div>
        </div>
      </span>
    </Isolate>
  </div>;
}


export const Stage = enhanceStage(StageBase);

export * from "./tools";
