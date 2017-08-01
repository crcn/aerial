import { fork, put, all, call, select } from "redux-saga/effects";
import { createContext } from "vm";
import { takeRequest, request, watch, waitUntil } from "aerial-common2";
import { ADD_SANDBOX_ENVIRONMENT, AddSandboxEnvironmentRequest, createAddDependencyRequest, createSandboxEnvironmentCreatedEvent, createSandboxEnvironmentEvaluatedEvent,
createEvaluateDependencyRequest } from "../actions";
import { getSandbox, getDependency, SandboxEnvironment, isDependencyTreeLoaded, getDependencyGraph } from "../state";


export function* sandboxEnvironmentSaga() {
  yield fork(handleAddSandboxEnvironment);
  yield fork(handleSandboxEnvironments);
}

function* handleAddSandboxEnvironment() {
  while(true) {
    yield takeRequest(ADD_SANDBOX_ENVIRONMENT, function*({ uri }: AddSandboxEnvironmentRequest) {
      const { payload: { hash } } = yield yield request(createAddDependencyRequest(uri));
      yield put(createSandboxEnvironmentCreatedEvent(hash));
    });
  }
}

function* handleSandboxEnvironments() {
  yield watch((root) => getSandbox(root), function*(sandbox) {
    yield* sandbox.environments.filter(env => !env.fresh).map(environment => call(runSandboxEnvironment, environment));
    return true;
  });
}

function* runSandboxEnvironment(environment: SandboxEnvironment) {
  yield waitUntil(root => isDependencyTreeLoaded(root, environment.entryHash));
  const root = yield select();
  const context = createContext({});

  const { payload: exports } = yield yield request(createEvaluateDependencyRequest(context, getDependency(root, environment.entryHash), getDependencyGraph(root)));

  yield put(createSandboxEnvironmentEvaluatedEvent(environment.$$id, exports));
}