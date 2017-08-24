// import { SEnvWindowInterface } from "../environment";
import { SyntheticDocument, SyntheticNode } from "../state";
import { Request, BaseEvent, generateDefaultId, Mutation, Point, Action } from "aerial-common2";
import { RenderedClientRects, RenderedComputedStyleDeclarations, SEnvWindowInterface } from "../environment";

export const OPEN_SYNTHETIC_WINDOW               = "OPEN_SYNTHETIC_WINDOW";
export const SYNTHETIC_WINDOW_RESOURCE_LOADED    = "SYNTHETIC_WINDOW_RESOURCE_LOADED";
export const NEW_SYNTHETIC_WINDOW_ENTRY_RESOLVED = "NEW_SYNTHETIC_WINDOW_ENTRY_RESOLVED";
export const FETCH_REQUEST                       = "FETCH_REQUEST";
export const SYNTHETIC_WINDOW_RECTS_UPDATED      = "SYNTHETIC_WINDOW_RECTS_UPDATED";
export const SYNTHETIC_WINDOW_LOADED             = "SYNTHETIC_WINDOW_LOADED";
export const SYNTHETIC_NODE_TEXT_CONTENT_CHANGED = "SYNTHETIC_NODE_TEXT_CONTENT_CHANGED";
export const NODE_VALUE_STOPPED_EDITING          = "NODE_VALUE_STOPPED_EDITING";
export const EDIT_SOURCE_CONTENT                 = "EDIT_SOURCE_CONTENT";
export const APPLY_FILE_MUTATIONS                = "APPLY_FILE_MUTATIONS";
export const SYNTHETIC_WINDOW_SCROLLED           = "SYNTHETIC_WINDOW_SCROLLED";
export const SYNTHETIC_WINDOW_SCROLL             = "SYNTHETIC_WINDOW_SCROLL";
export const SYNTHETIC_WINDOW_OPENED             = "SYNTHETIC_WINDOW_OPENED";
export const SYNTHETIC_WINDOW_PROXY_OPENED       = "SYNTHETIC_WINDOW_PROXY_OPENED";
export const SYNTHETIC_WINDOW_MOVED              = "SYNTHETIC_WINDOW_MOVED";
export const SYNTHETIC_WINDOW_RESIZED            = "SYNTHETIC_WINDOW_RESIZED";

export type FetchRequest = {
  info: RequestInfo;
} & Request;

export type SyntheticWindowSourceChanged = {
  type: string
  syntheticWindowId: string;
  window: any;
} & BaseEvent;

export type OpenSyntheticBrowserWindow = {
  uri: string;
  syntheticBrowserId: string;
} & Request;

export type NewSyntheticWindowEntryResolved = {
  location: string;
  syntheticBrowserId?: string;
} & BaseEvent;

export type SyntheticWindowRectsUpdated = {
  rects: RenderedClientRects;
  styles: RenderedComputedStyleDeclarations;
  syntheticWindowId: string;
} & BaseEvent;

export type SyntheticWindowLoaded = {
  allNodes: {
    [identifier: string]: SyntheticNode
  };
  document: SyntheticDocument;
  syntheticWindowId: string;
} & BaseEvent;

export type SyntheticNodeValueStoppedEditing = {
  syntheticWindowId: string;
  nodeId: string;
} & BaseEvent;

export type SyntheticWindowResourceLoaded = {
  uri: string;
  syntheticWindowId: string;
} & BaseEvent;

export type SyntheticNodeTextContentChanged = {
  syntheticWindowId: string;
  syntheticNodeId: string;
  textContent: string;
} & BaseEvent;

export type SyntheticWindowScrolled = {
  scrollPosition: Point;
  syntheticWindowId: string;
} & BaseEvent;

export type SyntheticWindowScroll = {
  scrollPosition: Point;
  syntheticWindowId: string;
} & Action;

export type SyntheticWindowOpened = {
  instance: SEnvWindowInterface;
  browserId: string;
  parentWindowId: string;
} & BaseEvent;

export type SyntheticWindowChanged = {
  instance: SEnvWindowInterface;
} & BaseEvent;

export type MutateSourceContentRequest<T extends Mutation<any>> = {
  type: string;
  mutation: T;
  content: string;
  contentType: string;
} & Request;

export type ApplyFileMutations = {
  type: string;
  mutations: Mutation<any>[];
} & Request;

export type windowPatched = {
  type: string;
  syntheticWindowId: string;
  document: SyntheticDocument;
} & BaseEvent;

export const mutateSourceContentRequest = (content: string, contentType: string, mutation: Mutation<any>): MutateSourceContentRequest<any> => ({
  content,
  mutation,
  contentType,
  $id: generateDefaultId(),
  type: EDIT_SOURCE_CONTENT,
});

export const syntheticWindowOpened = (instance: SEnvWindowInterface, browserId: string, parentWindowId?: string): SyntheticWindowOpened => ({
  parentWindowId,
  browserId,
  instance,
  type: SYNTHETIC_WINDOW_OPENED
});

export const syntheticWindowProxyOpened = (instance: SEnvWindowInterface, browserId: string, parentWindowId?: string): SyntheticWindowOpened => ({
  parentWindowId,
  browserId,
  instance,
  type: SYNTHETIC_WINDOW_PROXY_OPENED
});

export const syntheticWindowMoved = (instance: SEnvWindowInterface): SyntheticWindowChanged => ({
  instance,
  type: SYNTHETIC_WINDOW_MOVED
});

export const syntheticWindowResized = (instance: SEnvWindowInterface): SyntheticWindowChanged => ({
  instance,
  type: SYNTHETIC_WINDOW_RESIZED
});

export const applyFileMutationsRequest = (...mutations: Mutation<any>[]): ApplyFileMutations => ({
  mutations,
  $id: generateDefaultId(),
  type: APPLY_FILE_MUTATIONS,
});

export const testMutateContentRequest = (contentType: string, mutationType?: string) => ((action: MutateSourceContentRequest<any>) => action.type === EDIT_SOURCE_CONTENT && action.contentType === contentType && (!mutationType || action.mutation.$type === mutationType));

export const syntheticNodeValueStoppedEditing = (syntheticWindowId: string, nodeId: string): SyntheticNodeValueStoppedEditing => ({
  nodeId,
  syntheticWindowId,
  type: NODE_VALUE_STOPPED_EDITING
});

export const syntheticWindowScrolled = (syntheticWindowId: string, scrollPosition: Point): SyntheticWindowScrolled => ({
  scrollPosition,
  syntheticWindowId,
  type: SYNTHETIC_WINDOW_SCROLLED
});


export const syntheticWindowScroll = (syntheticWindowId: string, scrollPosition: Point): SyntheticWindowScroll => ({
  scrollPosition,
  syntheticWindowId,
  type: SYNTHETIC_WINDOW_SCROLL
});

export const syntheticNodeTextContentChanged = (syntheticWindowId: string, syntheticNodeId: string, textContent: string): SyntheticNodeTextContentChanged => ({
  textContent,
  syntheticNodeId,
  syntheticWindowId,
  type: SYNTHETIC_NODE_TEXT_CONTENT_CHANGED
});

export const fetchRequest = (info: RequestInfo): FetchRequest => ({
  info,
  type: FETCH_REQUEST,
  $id: generateDefaultId()
});

export const openSyntheticWindowRequest = (uri: string, syntheticBrowserId?: string): OpenSyntheticBrowserWindow => ({
  uri,
  syntheticBrowserId,
  type: OPEN_SYNTHETIC_WINDOW,
  $id: generateDefaultId()
});

export const newSyntheticWindowEntryResolved = (location: string, syntheticBrowserId?: string): NewSyntheticWindowEntryResolved => ({
  location,
  syntheticBrowserId,
  type: NEW_SYNTHETIC_WINDOW_ENTRY_RESOLVED,
});

export const syntheticWindowRectsUpdated = (syntheticWindowId: string, rects: RenderedClientRects, styles: RenderedComputedStyleDeclarations): SyntheticWindowRectsUpdated => ({
  rects,
  styles,
  syntheticWindowId,
  type: SYNTHETIC_WINDOW_RECTS_UPDATED,
});


export const syntheticWindowResourceLoaded = (syntheticWindowId: string, uri: string): SyntheticWindowResourceLoaded => ({
  uri,
  syntheticWindowId,
  type: SYNTHETIC_WINDOW_RESOURCE_LOADED,
});

export const syntheticWindowLoaded = (syntheticWindowId: string, document: SyntheticDocument, allNodes: { [identifier: string]: SyntheticNode }): SyntheticWindowLoaded => ({
  allNodes,
  document,
  syntheticWindowId,
  type: SYNTHETIC_WINDOW_LOADED,
});