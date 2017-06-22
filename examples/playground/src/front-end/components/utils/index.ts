import { IBus } from "mesh";
import * as React from "react";
import { getContext, withProps, InferableComponentEnhancer } from "recompose";

type Component<P> = React.ComponentClass<P> | React.StatelessComponent<P>;

export interface IBussedProps {
  bus: IBus<any, any>
}

export const withBus = <TProps>(BaseComponent: Component<TProps & IBussedProps>) => getContext<any, TProps>({
  kernel: React.PropTypes.object
})(BaseComponent) as Component<TProps>;
