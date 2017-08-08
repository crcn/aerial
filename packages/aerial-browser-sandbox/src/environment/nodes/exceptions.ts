import { weakMemo } from "aerial-common2";

export const getDOMExceptionClasses = weakMemo((context: any) => {

  class SEnvDOMException extends Error {

  }

  return {
    SEnvDOMException: SEnvDOMException
  };
});