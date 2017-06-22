import {ILogServiceConfig} from "aerial-common";

export interface IBackEndApplicationConfig extends ILogServiceConfig {
  http: {
    port: number
  },
  frontEnd: {
    entryPath: string
  }
}