import { noop } from "lodash";
import { immutable } from "../immutable";
import { DS_CHANGED } from "./messages"
import { Dispatcher, Message, whenType } from "../bus";

export type DataStoreState = {
  [identifier: string]: Object[]
};

export const dataStore = (initialData: DataStoreState, upstream: Dispatcher<any> = noop) => (downstream: Dispatcher<any>) => (message: Message) => {
  
};

export const whenDataStoreChanged = (downstream: Dispatcher<any>) => whenType(DS_CHANGED, downstream);