import { createImmutableObject, ImmutableObject } from "aerial-common2";


export type RootState = ImmutableObject<{
  progress: string;
}>;

export const createRootState = (): RootState => createImmutableObject({
  progress: undefined
});