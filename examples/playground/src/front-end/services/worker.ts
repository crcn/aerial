import { } from "aerial-common";

export type WorkerState = {
  isMaster: boolean
};

/*


export const initWorkerService = (db) => {
  return updateOne(first(db.collection), { isMaster: true });
};

*/

export const initWorkerService = () => {

};

export const whenWorker = (upstream) => (downstream) => {

}

export const whenMaster = (upstream) => (downstream) => {

}