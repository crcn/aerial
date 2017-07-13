import { createImmutableObject, ImmutableObject, ApplicationState, ApplicationStatusTypes } from "aerial-common2";

export type RootState = ImmutableObject<{
  id: string,
  count: number
}> & ApplicationState;

export const createRootState = (): RootState => createImmutableObject({
  id: "root",
  status: ApplicationStatusTypes.LOADING,
  count: 100
});