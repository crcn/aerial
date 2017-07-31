import { BaseEvent } from "aerial-common2";
import { Mutation } from "aerial-common";
import { SyntheticDocument } from "../../dom";

/**
 * Types
 */

export const RENDERED_DOCUMENT                = "RENDERED_DOCUMENT";
export const EVALUATED_APPLICATION            = "EVALUATED_APPLICATION";
export const OPEN_SYNTHETIC_WINDOW_REQUESTED  = "OPEN_SYNTHETIC_WINDOW_REQUESTED";
export const CLOSE_SYNTHETIC_WINDOW_REQUESTED = "CLOSE_SYNTHETIC_WINDOW_REQUESTED";
export const LEGACY_SYNTHETIC_DOM_CHANGED     = "LEGACY_SYNTHETIC_DOM_CHANGED";
export const SYNTHETIC_WINDOW_TITLE_CHANGED   = "SYNTHETIC_WINDOW_TITLE_CHANGED";
export const SYNTHETIC_WINDOW_MOUNT_CHANGED   = "SYNTHETIC_WINDOW_MOUNT_CHANGED";

/**
 * Shapes
 */

export type OpenSyntheticWindowRequested = {
  syntheticBrowserId: string;
  location: string
} & BaseEvent;

export type CloseSyntheticWindowRequested = {
  syntheticWindowId: string;
} & BaseEvent;

export type LegacySyntheticDOMChanged = {
  syntheticWindowId;
  mutation: Mutation<any>;
  legacyDocument: SyntheticDocument;
} & BaseEvent;

export type SyntheticWindowTitleChanged = {
  syntheticWindowId: string;
  title: string;
} & BaseEvent;

export type SyntheticWindowMountChanged = {
  syntheticWindowId: string;
  mount: HTMLElement;
} & BaseEvent;

/**
 * Factories
 */

export const openSyntheticWindowRequested = (syntheticBrowserId: string, location: string): OpenSyntheticWindowRequested => ({
  syntheticBrowserId,
  location,
  type: OPEN_SYNTHETIC_WINDOW_REQUESTED,
});

export const closeSyntheticWindowRequested = (syntheticWindowId: string): CloseSyntheticWindowRequested => ({
  type: CLOSE_SYNTHETIC_WINDOW_REQUESTED,
  syntheticWindowId,
});

export const legacySyntheticDOMChanged = (syntheticWindowId: string, legacyDocument: SyntheticDocument, mutation: Mutation<any>): LegacySyntheticDOMChanged => ({
  syntheticWindowId,
  legacyDocument,
  type: LEGACY_SYNTHETIC_DOM_CHANGED,
  mutation,
});

export const syntheticWindowMountChanged = (syntheticWindowId: string, mount: HTMLElement): SyntheticWindowMountChanged => ({
  mount,
  syntheticWindowId,
  type: SYNTHETIC_WINDOW_MOUNT_CHANGED,
});

export const syntheticWindowTitleChanged = (syntheticWindowId: string, title: string): SyntheticWindowTitleChanged => ({
  syntheticWindowId,
  title,
  type: SYNTHETIC_WINDOW_TITLE_CHANGED
});
