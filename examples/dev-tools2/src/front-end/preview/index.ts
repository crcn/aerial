import { initBaseApplication2 } from "aerial-common2";
import { mainSaga } from "./sagas";
import { mainReducer } from "./reducers";
import { ApplicationState } from "./state";

export const initApplication = (initialState: ApplicationState) => initBaseApplication2(
  initialState,
  mainReducer,
  mainSaga
);