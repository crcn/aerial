import "./windows.scss";
import * as React from "react";
import { compose, pure } from "recompose";
import { Workspace } from "front-end/state";
import { SyntheticWindow, SyntheticBrowser } from "aerial-browser-sandbox";
import { Dispatcher, getBoxSize, Translate, wrapEventToDispatch } from "aerial-common2";
import { stageToolWindowTitleClicked, stageToolWindowKeyDown, stageToolWindowBackgroundClicked } from "front-end/actions";

type WindowItemInnerProps = {
  window: SyntheticWindow;
  dispatch: Dispatcher<any>;
  translate: Translate;
};

const WindowItemComponentBase = ({ window, translate, dispatch }: WindowItemInnerProps) => {

  const style = {
    left: window.box.left,
    top: window.box.top,
    ...getBoxSize(window.box)
  };

  const titleScale = Math.max(1 / translate.zoom, 0.03);

  const titleStyle = {
    transform: `translateY(-${20 * titleScale}px) scale(${titleScale})`,
    transformOrigin: "top left"
  };

  const contentStyle = {
    boxShadow: `0 0 0 ${titleScale}px #DFDFDF`
  };
  
  return <div className="m-windows-stage-tool-item" style={style}>
    <div 
    className="m-windows-stage-tool-item-title" 
    tabIndex={-1} 
    style={titleStyle} 
    onKeyDown={wrapEventToDispatch(dispatch, stageToolWindowKeyDown.bind(this, window.$$id))} 
    onClick={wrapEventToDispatch(dispatch, stageToolWindowTitleClicked.bind(this, window.$$id))}>
      { window.document && window.document.title || window.location }
    </div>
    <div className="m-windows-stage-tool-item-content" style={contentStyle}>

    </div>
  </div>
};

const WindowItemComponent = pure(WindowItemComponentBase as any) as typeof WindowItemComponentBase;

export type WindowsStageToolComponentInnerProps = {
  workspace: Workspace;
  browser: SyntheticBrowser;
  dispatch: Dispatcher<any>;
};

export const WindowsStageToolComponentBase = ({ workspace, browser, dispatch }: WindowsStageToolComponentInnerProps) => {
  const { translate, backgroundColor } = workspace.visualEditorSettings;
  
  const backgroundStyle = {
    backgroundColor: backgroundColor || "rgba(0, 0, 0, 0.05)",
    transform: `translate(${-translate.left / translate.zoom}px, ${-translate.top / translate.zoom}px) scale(${1 / translate.zoom}) translateZ(0)`,
    transformOrigin: "top left"
  };
  return <div className="m-windows-stage-tool">
    <div style={backgroundStyle} className="m-windows-stage-tool-background" onClick={wrapEventToDispatch(dispatch, stageToolWindowBackgroundClicked)} /> 
    {
      browser.windows.map((window) => <WindowItemComponent key={window.$$id} window={window} dispatch={dispatch} translate={translate} />)
    }
  </div>;
}

export const WindowsStageToolComponent = pure(WindowsStageToolComponentBase as any) as typeof WindowsStageToolComponentBase;