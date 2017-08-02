import { 
  WriteUriRequest,
  uriProtocolReducer,
  createReadUriRequest,
  createWriteUriRequest,
  createDeleteUriRequest,
  createWatchUriRequest,
  createUnwatchUriRequest,
  createURIProtocolSaga,
  createURIProtocolState,
} from "aerial-sandbox2";

export const timeout = (ms = 10) => new Promise(resolve => setTimeout(resolve, ms));

export const removeProtocolName = (uri: string) => uri.replace(/^\w+:\/\//, "");

export const createTestProtocolAdapter = (name: string, testFiles) => {
  const listeners = {};
  return {
    name: name,
    async read(uri: string) {
      return testFiles[removeProtocolName(uri)];
    },
    async write(uri: string, content: any, type?: string) {
      const oldFile = testFiles[removeProtocolName(uri)];
      const newContent = testFiles[removeProtocolName(uri)] = {
        type: type || oldFile.type,
        content: content
      };
      if (listeners[uri]) {
        listeners[uri](newContent);
      }
    },
    async delete(uri: string) {
      delete testFiles[removeProtocolName(uri)];
    },
    watch(uri: string, onChange: any) {
      listeners[uri] = onChange;
      return () => {
        
      };
    },
  };
}