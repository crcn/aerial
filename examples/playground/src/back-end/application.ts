import { mainSaga } from "./sagas";
import { mainReducer } from "./reducers";
import { noop, flowRight } from "lodash";
import { ApplicationState } from "./state";
import { initBaseApplication2, ConsoleLogState, BaseApplicationState } from "aerial-common2";

export const initApplication = (initialState?:  ApplicationState) => initBaseApplication2(initialState,  mainReducer, mainSaga);

