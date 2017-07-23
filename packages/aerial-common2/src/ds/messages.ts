import { Action } from "../bus";
import { Struct } from "../struct";
import { readAll } from "mesh";
import { Dispatcher } from "../bus";
import { DSCollectionInfo } from "./structs";

export const DS_FIND_ONE = "DS_FIND_ONE";
export const DS_FIND_ALL = "DS_FIND_ALL";
export const DS_UPDATE   = "DS_UPDATE";
export const DS_REMOVE   = "DS_REMOVE";
export const DS_INSERT   = "DS_INSERT";
export const DS_BATCH    = "DS_BATCH";
export const DS_CHANGED  = "DS_CHANGED";

// export const createDSFindAction = (query)

export type DSAction = {
  collectionName: string
} & Action;


export type DSBatchAction = {
  actions: DSAction[]
} & Action;

export type DSFindOneAction = {
  id: string;
} & DSAction;

export type DSFindAllAction = {
  collectionName: string
} & DSAction;

export type DSUpdateAction = {
  data: any
} & DSAction;

export type DSRemoveAction = {
  id: string
} & DSAction;

export type DSInsertAction = {
  data: any;
} & DSAction;

export const dsBatchAction = (...actions: DSAction[]): DSBatchAction => ({
  type: DS_BATCH,
  actions: actions
});

export const dsFindOneAction = (collectionName: string, id: string) => ({
  collectionName,
  id
});


export const dsBatch = (dispatch: Dispatcher<any>) => (action: DSBatchAction) => readAll(dispatch(action));