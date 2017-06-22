import * as React from "react";
import { Kernel } from "aerial-common";
import { withContext, compose } from "recompose";
import { withBus } from "../utils";

export interface IRootComponentBaseProps {
  kernel: Kernel
};

const RootComponentBase = ({ kernel }: IRootComponentBaseProps) => {
  return <div>
    Hello Front End
  </div>;
};

const enhanceRootComponent = compose<IRootComponentBaseProps, IRootComponentBaseProps>(
  withContext({
    kernel: React.PropTypes.object
  }, ({ kernel }) => ({ kernel }))
);

export const RootComponent = enhanceRootComponent(RootComponentBase);

