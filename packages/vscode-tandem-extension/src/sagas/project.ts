import { ExtensionState } from "../state";
import * as path from "path";
import * as fs from "fs";
import * as getPort from "get-port";
import { spawn, ChildProcess } from "child_process";
import { take, fork, select, put, call } from "redux-saga/effects";
import { delay } from "redux-saga";
import { VISUAL_TOOLS_CONFIG_FILE_NAME } from "../constants";
import { alert, AlertLevel, visualDevConfigLoaded, VISUAL_DEV_CONFIG_LOADED, childDevServerStarted } from "../actions";

export function* projectSaga() {
  yield fork(startDevServer);
  yield fork(handleDevConfigLoaded);
}

function* startDevServer() {
  const { rootPath }: ExtensionState = yield select();
  const configFilePath = path.join(rootPath, VISUAL_TOOLS_CONFIG_FILE_NAME);

  if (!fs.existsSync(configFilePath)) {
    return yield put(alert(`${VISUAL_TOOLS_CONFIG_FILE_NAME} not found in project directory`, AlertLevel.ERROR))
  }

  yield put(visualDevConfigLoaded(require(configFilePath)));
}

function* handleDevConfigLoaded() {
  let devServerProcess: ChildProcess;

  while(true) {
    yield take(VISUAL_DEV_CONFIG_LOADED);

    if (devServerProcess) {
      devServerProcess.kill();
    }

    const { 
      visualDevConfig: { vscode },
      rootPath
    }: ExtensionState = yield select();

    const devServerScript = vscode && vscode.devServerScript;

    if (!devServerScript) {
      yield put(alert(`vscode.devServerScript not found in ${VISUAL_TOOLS_CONFIG_FILE_NAME}`));
      continue;
    }
    
    const [bin, ...args] = devServerScript;

    const childServerPort = yield call(getPort);
    console.log(`spawning dev server command "${bin} ${args.join("")}" with env PORT ${childServerPort}`);

    devServerProcess = spawn(bin, args, {
      cwd: rootPath,
      stdio: ["pipe", "pipe", "pipe"],
      env: {
        ...process.env,
        PORT: childServerPort
      }
    });

    // slight timeout to allow child server to start
    yield call(delay, 3000);

    yield put(childDevServerStarted(childServerPort));

    // TODO - dispatch child satarted
  }
}
