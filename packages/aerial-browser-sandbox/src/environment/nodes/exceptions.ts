import { weakMemo } from "aerial-common2";

export const getDOMExceptionClasses = weakMemo((window: Window) => {

  class SEnvDOMException extends Error {

  }

  return {
    SEnvDOMException: SEnvDOMException
  };
});