import * as express from "express";
import { HTTPContext } from "../http";
import { reader, ImmutableObject } from "aerial-common2";

export type FrontEndConfig = {
  
};

export type FrontEndContext = ImmutableObject<{
  
}> & HTTPContext;

export const initFrontEndService = (config: FrontEndConfig) => reader((context: FrontEndContext) => {
  return context;
});