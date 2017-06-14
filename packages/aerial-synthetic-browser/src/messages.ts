import { CoreEvent, MutationEvent, TreeNodeMutationTypes, serializable } from "aerial-common";
import { ISyntheticBrowserOpenOptions } from "./index";
import { SyntheticCSSStyle } from "./dom/css";
import {
  isCSSMutation,
  isDOMNodeMutation,
  SyntheticDOMElement,
  CSSGroupingRuleMutationTypes,
  SyntheticDocumentMutationTypes,
  SyntheticDOMElementMutationTypes,
  SyntheticDOMContainerMutationTypes,
  SyntheticDOMValueNodeMutationTypes,
  SyntheticCSSElementStyleRuleMutationTypes,
} from "./dom";

export class DOMNodeEvent extends CoreEvent {
  static readonly DOM_NODE_LOADED = "domNodeLoaded";
}

export class SyntheticRendererNodeEvent extends CoreEvent {
  static readonly NODE_EVENT = "nodeEvent";
  constructor(readonly element: SyntheticDOMElement, event: any) {
    super(SyntheticRendererNodeEvent.NODE_EVENT);
  }
}

export class SyntheticRendererEvent extends CoreEvent {
  static readonly UPDATE_RECTANGLES = "updateRectangles";
  constructor(type: string) {
    super(type);
  }
}

@serializable("OpenRemoteBrowserRequest")
export class OpenRemoteBrowserRequest extends CoreEvent {
  static readonly OPEN_REMOTE_BROWSER = "openRemoteBrowser";
  constructor(readonly options: ISyntheticBrowserOpenOptions) {
    super(OpenRemoteBrowserRequest.OPEN_REMOTE_BROWSER);
  }
}
