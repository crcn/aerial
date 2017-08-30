import { initBaseApplication2 } from "aerial-common2";
import { ApplicationState } from "./state";
import { mainReducer } from "./reducers";
import { mainSaga } from "./sagas";

export const initApplication = (initialState: ApplicationState) => initBaseApplication2(
  initialState,
  mainReducer,
  mainSaga
);