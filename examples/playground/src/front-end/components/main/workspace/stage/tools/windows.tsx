import "./windows.scss";
import * as React from "react";
import { compose, pure } from "recompose";
import { Workspace } from "front-end/state";
import { SyntheticWindow, SyntheticBrowser } from "aerial-browser-sandbox";
import { Dispatcher, getBoundsSize, Translate, wrapEventToDispatch } from "aerial-common2";
import { stageToolWindowTitleClicked, stageToolWindowKeyDown, stageToolWindowBackgroundClicked } from "front-end/actions";

type WindowItemInnerProps = {
  window: SyntheticWindow;
  dispatch: Dispatcher<any>;
  translate: Translate;
  fullScreenWindowId: string;
};

const WindowItemBase = ({ window, translate, dispatch, fullScreenWindowId }: WindowItemInnerProps) => {

  if (fullScreenWindowId && fullScreenWindowId !== window.$id) {
    return null;
  }

  const { width, height } = getBoundsSize(window.bounds);

  const style = {
    width,
    height,
    left: window.bounds.left,
    top: window.bounds.top,
    background: "transparent",
  };

  const titleScale = Math.max(1 / translate.zoom, 0.03);

  const titleStyle = {
    transform: `translateY(-${20 * titleScale}px) scale(${titleScale})`,
    transformOrigin: "top left",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: width * translate.zoom,
  };

  const contentStyle = {
    // boxShadow: `0 0 0 ${titleScale}px #DFDFDF`
    background: "transparent"
  };
  
  return <div className="m-windows-stage-tool-item" style={style}>
    <div 
    className="m-windows-stage-tool-item-title" 
    tabIndex={-1} 
    style={titleStyle as any} 
    onKeyDown={wrapEventToDispatch(dispatch, stageToolWindowKeyDown.bind(this, window.$id))} 
    onClick={wrapEventToDispatch(dispatch, stageToolWindowTitleClicked.bind(this, window.$id))}>
      { window.document && window.document.title || window.location }
    </div>
    <div className="m-windows-stage-tool-item-content" style={contentStyle}>

    </div>
  </div>
};

const WindowItem = pure(WindowItemBase as any) as typeof WindowItemBase;

export type WindowsStageToolInnerProps = {
  translate: Translate;
  workspace: Workspace;
  browser: SyntheticBrowser;
  dispatch: Dispatcher<any>;
};

export const WindowsStageToolBase = ({ workspace, browser, translate, dispatch }: WindowsStageToolInnerProps) => {
  const { backgroundColor, fullScreenWindowId } = workspace.stage;

  const backgroundStyle = {
    backgroundColor: backgroundColor || "rgba(0, 0, 0, 0.05)",
    transform: `translate(${-translate.left / translate.zoom}px, ${-translate.top / translate.zoom}px) scale(${1 / translate.zoom}) translateZ(0)`,
    transformOrigin: "top left"
  };
  return <div className="m-windows-stage-tool">
    <div style={backgroundStyle} className="m-windows-stage-tool-background" onClick={wrapEventToDispatch(dispatch, stageToolWindowBackgroundClicked)} /> 
    {
      browser.windows.map((window) => <WindowItem key={window.$id} window={window} fullScreenWindowId={fullScreenWindowId} dispatch={dispatch} translate={translate} />)
    }
  </div>;
}

export const WindowsStageTool = pure(WindowsStageToolBase as any) as typeof WindowsStageToolBase;