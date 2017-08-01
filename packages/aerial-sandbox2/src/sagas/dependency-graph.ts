import { fork, take, put, call } from "redux-saga/effects";
import { takeRequest, request, getValuesByType, watch } from "aerial-common2";
import { hasURIProtocol, getDependencyGraph, DependencyGraph, Dependency, LoadedDependencyContentResult, DependencyStatus } from "../state";
import * as Url from "url";
import * as md5 from "md5";
import * as path from "path";
import { uniq } from "lodash";
import { 
  createReadUriRequest,
  ADD_DEPENDENCY,
  LoadedDependencyContentResponse,
  createDependencyCreatedEvent,
  RESOLVE_DEPENDENCY,
  createResolveDependencyRequest,
  AddDependencyRequest,
  ResolveDependencyResponse,
  LOAD_DEPENDENCY,
  createDependencyContentLoadedEvent,
  LOAD_DEPENDENCY_CONTENT,
  createAddDependencyRequest,
  createDependencyChildrenAddedEvent,
  DEFAULT_GRAPH_STRATEGY_LOAD_CONTENT,
  createLoadDependencyContentRequest,
  ResolveDependencyRequest,
  LoadDependencyRequest,
  LoadDependencyContentRequest,
  createDefaultGraphStrategyLoadContentRequest,
} from "../actions";

export const createDependencyGraphSaga = () => {
  return function*() {
    yield fork(handleDefaultDependencyGraphStragy);
    yield fork(handleAddDependency);
    yield fork(handleIdleDependencies);
  };
}

function* handleAddDependency() {
  while(true) {
    yield takeRequest(ADD_DEPENDENCY, function*({ uri, originUri }: AddDependencyRequest) {
      const { payload: resolvedDependencyInfo } = (yield yield request(createResolveDependencyRequest(uri, originUri))) as ResolveDependencyResponse;
      yield put(createDependencyCreatedEvent(resolvedDependencyInfo));
      return resolvedDependencyInfo;
    });
  }
}

function* handleIdleDependencies() {
  yield watch((root) => getDependencyGraph(root), function*({ allDependencies }: DependencyGraph) {
    for (const hash in allDependencies) {
      const dep = allDependencies[hash];
      if (dep.status === DependencyStatus.IDLE) {
        yield call(loadDependency, dep);
      } else if (dep.status === DependencyStatus.CONTENT_LOADED) {
        yield call(loadChildDependencies, dep);
      }
    }
    return true;
  });
}

function* loadDependency(dep: Dependency) {
  const { payload: readResult } = yield yield request(createReadUriRequest(dep.uri));
  
  const { payload: loadedResult } = (yield yield request(createLoadDependencyContentRequest(readResult.content, readResult.type, dep.contentLoaderOptions))) as LoadedDependencyContentResponse;

  // save current snapshot
  yield put(createDependencyContentLoadedEvent(dep.$$id, loadedResult));
}

function* loadChildDependencies(dep: Dependency) {
  const importedDependencyHashes = [];
  for (const uri of dep.importedDependencyUris) {
    const { payload: { hash } } = (yield yield request(createAddDependencyRequest(uri, dep.uri))) as ResolveDependencyResponse;
    importedDependencyHashes.push(hash);
  }

  // save current snapshot
  yield put(createDependencyChildrenAddedEvent(dep.$$id, importedDependencyHashes));
}

function* handleDefaultDependencyGraphStragy(options = { rootDirectoryUri: null }) {
  yield fork(function* handlResolveDependency() {
    while(true) {
      yield takeRequest(RESOLVE_DEPENDENCY, ({ uri: relativeUri, originUri }: ResolveDependencyRequest) => {

        // const relativeUriPathname = uriParts.pathname && path.normalize(uriParts.pathname);
        // TODO - move this logic to HTTPFileResolver instead
        let resolvedUri;
        const uriParts = Url.parse(relativeUri);
        const relativeUriPathname = uriParts.pathname && path.normalize(uriParts.pathname);

        // strip to ensure that
        if (originUri) originUri = originUri.replace("file://", "");

        // protocol?
        if (hasURIProtocol(relativeUri)) {
          resolvedUri = relativeUri;
        } else {
          // root
          if (relativeUri.charAt(0) === "/" || !originUri) {
            if (originUri && hasURIProtocol(originUri)) {
              const originParts = Url.parse(originUri);

              // omit slash if relative URI has it
              resolvedUri = originParts.protocol + "//" + originParts.host + (relativeUriPathname.charAt(0) === "/" ? relativeUriPathname : "/" + relativeUriPathname);
            } else {
              resolvedUri = (options.rootDirectoryUri || "file:///") + relativeUriPathname;
            }
          } else {
            const originParts = hasURIProtocol(originUri) ? Url.parse(originUri) : { 
              protocol: "file:",
              host: "",
              pathname: originUri
            };

            resolvedUri = originParts.protocol + "//" + path.join(originParts.host || "", path.dirname(originParts.pathname), relativeUriPathname);
          }
        }

        return {
          uri: resolvedUri,
          hash: md5(resolvedUri)
        };
      });
    }
  });

  yield fork(function* handleLoadContent() {
    while(true) {
      yield takeRequest(LOAD_DEPENDENCY_CONTENT, function*({ content, contentType, options }: LoadDependencyContentRequest) {
        let currentContent     = content;
        let currentContentType = contentType;
        let importedDependencyUris = [];
        while(true) {
          const { payload } = yield yield request(createDefaultGraphStrategyLoadContentRequest(content, contentType));

          importedDependencyUris = [...importedDependencyUris, ...(payload.importedDependencyUris || [])];
          
          if (payload.content === currentContent && payload.contentType === currentContentType) {
            break;
          }

          currentContent = currentContent;
          currentContentType = currentContentType;
        }

        return {
          content: currentContent,
          contentType: currentContentType,
          importedDependencyUris: uniq(importedDependencyUris)
        } as LoadedDependencyContentResult;
      });

    }
  });

  yield fork(function* handleLoadDefaultContent() {
    while(true) {
      yield takeRequest(DEFAULT_GRAPH_STRATEGY_LOAD_CONTENT, ({ content, contentType, options }: LoadDependencyContentRequest) => ({
        content,
        contentType
      }));
    }
  });
}