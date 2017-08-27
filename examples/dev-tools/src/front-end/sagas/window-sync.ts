// import { fork, take } from "redux-saga/effects";
// import { diffArray, eachArrayValueMutation } from "aerial-common2";
// import { WATCHING_FILES, WatchingFiles } from "../actions";

// export function* windowSyncSaga() {
//   yield fork(handleWatchingFiles);
// }

// function* handleWatchingFiles() {
//   let currentFilePaths: string[] = [];
//   let currentWindows: Window[] = [];
//   while(true) {
//     const { filePaths }: WatchingFiles = yield take(WATCHING_FILES);
//     const diffs = diffArray(
//       currentFilePaths,
//       filePaths,
//       (a, b) => a === b ? 0 : -1
//     );

//     eachArrayValueMutation(diffs, {
//       insert({ value, index }) {
//         currentWindows.splice(index, 0, open())
//       },
//       delete({ index }) {

//       },
//       update({ newValue, index }) {

//       }
//     })
//   }
// }