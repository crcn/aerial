// https://github.com/tandemcode/tandem/blob/master/src/%40tandem/editor/browser/components/pages/workspace/mid/center/canvas/index.tsx#L270

import "./index.scss";
import * as React from "react";
import { readAll } from "mesh";
import { Workspace } from "front-end/state";
import { ToolsLayerComponent } from "./tools";
import { CanvasComponent } from "./canvas";
import { IsolateComponent } from "front-end/components/isolated";
import { Dispatcher, BaseEvent, Point } from "aerial-common2";
import { SyntheticBrowser2, SyntheticDOMRenderer } from "aerial-synthetic-browser";
import { lifecycle, compose, withState, withHandlers, pure, Component } from "recompose";

const PANE_SENSITIVITY = process.platform === "win32" ? 0.1 : 1;
const ZOOM_SENSITIVITY = process.platform === "win32" ? 2500 : 250;

export const VISUAL_EDITOR_WHEEL = "VISUAL_EDITOR_WHEEL";
export type VisualEditorWheel = {
  mouseX: number;
  mouseY: number;
  workspaceId: string;
  canvasWidth: number;
  canvasHeight: number;
  type: string;
  metaKey: boolean;
  ctrlKey: boolean;
  deltaX: number;
  deltaY: number;
} & BaseEvent;

export const visualEditorWheel = (workspaceId: string, canvasWidth: number, canvasHeight: number, mousePosition: Point, { metaKey, ctrlKey, deltaX, deltaY, clientX, clientY }: React.WheelEvent<any>): VisualEditorWheel => ({
  workspaceId,
  metaKey,
  mouseX: mousePosition.left,
  mouseY: mousePosition.top,
  canvasWidth,
  canvasHeight,
  ctrlKey,
  deltaX,
  deltaY,
  type: VISUAL_EDITOR_WHEEL,
})

export type VisualEditorOuterComponentProps = {
  workspace: Workspace;
  dispatch: Dispatcher<any>;
};

export type VisualEditorInnerComponentProps = {
  canvasOuter: HTMLElement;
  onWheel: (event: React.SyntheticEvent<MouseEvent>) => any;
  mousePosition: Point;
  onDrop: (event: React.SyntheticEvent<any>) => any;
  onMouseEvent: (event: React.SyntheticEvent<any>) => any;
  onMouseDown: (event: React.SyntheticEvent<any>) => any;
  onDragEnter: (event: React.SyntheticEvent<any>) => any;
  onDragExit: (event: React.SyntheticEvent<any>) => any;
  setCanvasOuter: (element: HTMLElement) => any;
} & VisualEditorOuterComponentProps;

const enhanceVisualEditorComponent = compose<VisualEditorOuterComponentProps, VisualEditorInnerComponentProps>(
  pure,
  withState('canvasOuter', 'setCanvasOuter', null),
  withState('mousePosition', 'setMousePosition', null),
  withHandlers({
    onMouseEvent: ({ setMousePosition }) => (event: React.MouseEvent<any>) => {
      setMousePosition({ left: event.pageX, top: event.pageY });
    },
    onWheel: ({ workspace, dispatch, canvasOuter, mousePosition }: VisualEditorInnerComponentProps) => (event: React.WheelEvent<any>) => {
      const rect = canvasOuter.getBoundingClientRect();
      readAll(dispatch(visualEditorWheel(workspace.$$id, rect.width, rect.height, mousePosition, event)));
    }
  })
);

export const VisualEditorComponentBase = ({ 
  setCanvasOuter,
  workspace, 
  dispatch, 
  onWheel,
  onDrop,
  onMouseEvent,
  onDragEnter,
  onMouseDown,
  onDragExit
}: VisualEditorInnerComponentProps) => {
  if (!workspace) return null;

  const { translate, cursor } = workspace.visualEditorSettings;

  const outerStyle = {
    cursor: cursor || "default"
  }

  const innerStyle = {
    transform: `translate(${translate.left}px, ${translate.top}px) scale(${translate.zoom})`
  };

  return <div className="visual-editor-component">
    <IsolateComponent 
    inheritCSS 
    ignoreInputEvents
    className="visual-editor-component-isolate"
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
          className="visual-editor-inner"
          style={outerStyle}>
          <div style={innerStyle} className="visual-editor-inner">
            <CanvasComponent browser={workspace.browser} dispatch={dispatch} />
            <ToolsLayerComponent workspace={workspace} dispatch={dispatch} />
          </div>
        </div>
      </span>
    </IsolateComponent>
  </div>;
}


export const VisualEditorComponent = enhanceVisualEditorComponent(VisualEditorComponentBase as any) as any as Component<VisualEditorOuterComponentProps>;

export * from "./canvas";
