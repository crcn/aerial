import { BaseEvent } from "aerial-common2";

/**
 * Types
 */

export const RENDERED_DOCUMENT                 = "RENDERED_DOCUMENT";
export const EVALUATED_APPLICATION             = "EVALUATED_APPLICATION";
export const OPEN_SYNTHETIC_WINDOW_REQUESTED   = "OPEN_SYNTHETIC_WINDOW_REQUESTED";
export const CLOSE_SYNTHETIC_WINDOW_REQUESTED  = "CLOSE_SYNTHETIC_WINDOW_REQUESTED";

/**
 * Shapes
 */

export type OpenSyntheticWindowRequested = {
  location: string
} & BaseEvent;

/**
 * Shapes
 */

export type CloseSyntheticWindowRequested = {
  syntheticWindowId: string
} & BaseEvent;

/**
 * Factories
 */

export const openSyntheticWindowRequested = (location: string): OpenSyntheticWindowRequested => ({
  location,
  type: OPEN_SYNTHETIC_WINDOW_REQUESTED,
});

export const closeSyntheticWindowRequested = (syntheticWindowId: string): CloseSyntheticWindowRequested => ({
  syntheticWindowId,
  type: CLOSE_SYNTHETIC_WINDOW_REQUESTED,
});