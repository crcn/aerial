import * as express from "express";
import { BaseApplicationState } from "aerial-common2";

export type HTTPServerState = {
  http: {
    expressServer?: express.Express,
    port: number
  }
};

export type FrontEndState = {
  frontEnd: {
    entryPath: string,
    cssPath: string
  }
} & HTTPServerState;

export type ApplicationState =  BaseApplicationState & FrontEndState & HTTPServerState;