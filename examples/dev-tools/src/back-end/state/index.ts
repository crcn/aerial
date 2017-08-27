import { Struct, BaseApplicationState } from "aerial-common2";

export type ApplicationState = {
  http: {
    port: number;
  };
  watchingFilePaths: string[],
  config: {
    sourceFiles: string;
  }
} & BaseApplicationState;

