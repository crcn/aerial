import * as React from "react";
import { getContext } from "recompose";

export const getDispatcher = getContext({
  dispatch: React.PropTypes.func
});