import { ImmutableObject, createImmutableObject, ApplicationState } from "aerial-common2";

export type RootState = ImmutableObject<{
  element: HTMLElement
}> & ApplicationState;

export const createRootState = (element: HTMLElement): RootState => createImmutableObject({
  element
});