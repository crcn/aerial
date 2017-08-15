// import { SEnvWindowInterface } from "../environment";
import { SyntheticDocument } from "../state";
import { Request, BaseEvent, generateDefaultId, Mutation } from "aerial-common2";
import { RenderedClientRects, RenderedComputedStyleDeclarations } from "../environment";

export const OPEN_SYNTHETIC_WINDOW               = "OPEN_SYNTHETIC_WINDOW";
export const SYNTHETIC_WINDOW_RESOURCE_LOADED    = "SYNTHETIC_WINDOW_RESOURCE_LOADED";
export const NEW_SYNTHETIC_WINDOW_ENTRY_RESOLVED = "NEW_SYNTHETIC_WINDOW_ENTRY_RESOLVED";
export const SYNTHETIC_WINDOW_SOURCE_CHANGED     = "SYNTHETIC_WINDOW_SOURCE_CHANGED";
export const FETCH_REQUEST                       = "FETCH_REQUEST";
export const SYNTHETIC_WINDOW_RECTS_UPDATED      = "SYNTHETIC_WINDOW_RECTS_UPDATED";
export const SYNTHETIC_WINDOW_LOADED             = "SYNTHETIC_WINDOW_LOADED";
export const SYNTHETIC_NODE_TEXT_CONTENT_CHANGED = "SYNTHETIC_NODE_TEXT_CONTENT_CHANGED";
export const SYNTHETIC_WINDOW_PERSIST_CHANGES    = "SYNTHETIC_WINDOW_PERSIST_CHANGES";
export const EDIT_SOURCE_CONTENT                 = "EDIT_SOURCE_CONTENT";
export const APPLY_FILE_MUTATIONS                = "APPLY_FILE_MUTATIONS";

export type FetchRequest = {
  info: RequestInfo;
} & Request;

export type SyntheticWindowSourceChangedEvent = {
  type: string
  syntheticWindowId: string;
  window: any;
} & BaseEvent;

export type OpenSyntheticBrowserWindowRequest = {
  uri: string;
  syntheticBrowserId: string;
} & Request;

export type NewSyntheticWindowEntryResolvedEvent = {
  location: string;
  syntheticBrowserId?: string;
} & BaseEvent;

export type SyntheticWindowRectsUpdatedEvent = {
  rects: RenderedClientRects;
  styles: RenderedComputedStyleDeclarations;
  syntheticWindowId: string;
} & BaseEvent;

export type SyntheticWindowLoadedEvent = {
  document: SyntheticDocument;
  syntheticWindowId: string;
} & BaseEvent;

export type SyntheticWindowPersistChangesRequest = {
  syntheticWindowId: string;
} & Request;

export type SyntheticWindowResourceLoadedEvent = {
  uri: string;
  syntheticWindowId: string;
} & BaseEvent;

export type SyntheticNodeTextContentChanged = {
  syntheticWindowId: string;
  syntheticNodeId: string;
  textContent: string;
} & BaseEvent;

export type MutateSourceContentRequest<T extends Mutation<any>> = {
  type: string;
  mutation: T;
  content: string;
  contentType: string;
} & Request;

export type ApplyFileMutationsRequest = {
  type: string;
  mutations: Mutation<any>[];
} & Request;

export type SyntheticWindowPatchedEvent = {
  type: string;
  syntheticWindowId: string;
  document: SyntheticDocument;
} & BaseEvent;

export const createSyntheticWindowSourceChangedEvent = (syntheticWindowId: string, window: any): SyntheticWindowSourceChangedEvent => ({
  window,
  syntheticWindowId,
  type: SYNTHETIC_WINDOW_SOURCE_CHANGED
});

export const createMutateSourceContentRequest = (content: string, contentType: string, mutation: Mutation<any>): MutateSourceContentRequest<any> => ({
  content,
  mutation,
  contentType,
  $$id: generateDefaultId(),
  type: EDIT_SOURCE_CONTENT,
});

export const createApplyFileMutationsRequest = (...mutations: Mutation<any>[]): ApplyFileMutationsRequest => ({
  mutations,
  $$id: generateDefaultId(),
  type: APPLY_FILE_MUTATIONS,
});

export const testMutateContentRequest = (contentType: string, mutationType?: string) => ((action: MutateSourceContentRequest<any>) => action.type === EDIT_SOURCE_CONTENT && action.contentType === contentType && (!mutationType || action.mutation.$$type === mutationType));

export const createSyntheticWindowPersistChangesRequest = (syntheticWindowId: string): SyntheticWindowPersistChangesRequest => ({
  syntheticWindowId,
  $$id: generateDefaultId(),
  type: SYNTHETIC_WINDOW_PERSIST_CHANGES
});

export const createSyntheticNodeTextContentChanged = (syntheticWindowId: string, syntheticNodeId: string, textContent: string): SyntheticNodeTextContentChanged => ({
  textContent,
  syntheticNodeId,
  syntheticWindowId,
  type: SYNTHETIC_NODE_TEXT_CONTENT_CHANGED
});

export const createFetchRequest = (info: RequestInfo): FetchRequest => ({
  info,
  type: FETCH_REQUEST,
  $$id: generateDefaultId()
});

export const createOpenSyntheticWindowRequest = (uri: string, syntheticBrowserId?: string): OpenSyntheticBrowserWindowRequest => ({
  uri,
  syntheticBrowserId,
  type: OPEN_SYNTHETIC_WINDOW,
  $$id: generateDefaultId()
});

export const createNewSyntheticWindowEntryResolvedEvent = (location: string, syntheticBrowserId?: string): NewSyntheticWindowEntryResolvedEvent => ({
  location,
  syntheticBrowserId,
  type: NEW_SYNTHETIC_WINDOW_ENTRY_RESOLVED,
});

export const createSyntheticWindowRectsUpdated = (syntheticWindowId: string, rects: RenderedClientRects, styles: RenderedComputedStyleDeclarations): SyntheticWindowRectsUpdatedEvent => ({
  rects,
  styles,
  syntheticWindowId,
  type: SYNTHETIC_WINDOW_RECTS_UPDATED,
});


export const createSyntheticWindowResourceLoadedEvent = (syntheticWindowId: string, uri: string): SyntheticWindowResourceLoadedEvent => ({
  uri,
  syntheticWindowId,
  type: SYNTHETIC_WINDOW_RESOURCE_LOADED,
});

export const createSyntheticWindowLoadedEvent = (syntheticWindowId: string, document: SyntheticDocument): SyntheticWindowLoadedEvent => ({
  syntheticWindowId,
  document,
  type: SYNTHETIC_WINDOW_LOADED,
});