import { BaseSyntheticWindowRenderer } from "./base";

export class NoopRendererer extends BaseSyntheticWindowRenderer {
  readonly mount: HTMLElement = null;
}

export const createNoopRenderer = (window: Window) => {
  return new NoopRendererer(window);
}