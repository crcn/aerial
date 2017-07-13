import { createImmutableObject, ImmutableObject, ApplicationState, ApplicationStatusTypes } from "aerial-common2";
import * as http from "http";

export type RootState = ImmutableObject<{
  id: string,
  count: number,
  server: http.Server
}> & ApplicationState;

export const createRootState = (): RootState => createImmutableObject({
  id: "root",
  status: ApplicationStatusTypes.LOADING,
  count: 100
});