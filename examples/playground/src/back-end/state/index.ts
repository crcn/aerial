import { createImmutableObject, ImmutableObject } from "aerial-common2";


export type RootState = ImmutableObject<{
  progress: string;
  count: number;
}>;

export const createRootState = (): RootState => createImmutableObject({
  progress: undefined,
  count: 100
});