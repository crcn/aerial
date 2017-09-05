import { ApplicationState } from "../state";
export const getAPIProxyUrl = (uri: string, state: ApplicationState) => (
  `${window.location.protocol}//${state.apiHost}/proxy/${encodeURIComponent(uri)}`
);