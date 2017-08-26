import { Struct, BaseApplicationState } from "aerial-common2";

export type RootState = {
  http: {
    port: number;
  };
  cwd: string
} & BaseApplicationState;

