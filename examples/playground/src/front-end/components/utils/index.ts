import { map } from "lodash";
import * as React from "react";
import { PrivateBusProvider, Provider, Kernel } from "aerial-common";
import { compose, getContext, withProps, InferableComponentEnhancer, ComponentEnhancer } from "recompose";

export type Component<P> = React.ComponentClass<P> | React.StatelessComponent<P>;

export interface IKernelProps {
  kernel: Kernel;
}

export const withKernel = <TProps>(BaseComponent: Component<TProps & IKernelProps>) => getContext<any, TProps>({
  kernel: React.PropTypes.object
})(BaseComponent) as Component<TProps>;

export type ProviderMap = <T, U>(provider: Provider<T>) => U;

export type IInjectValueOptions = string | {
  id: string,
  map: ProviderMap
};

export type IInjectValueMultiOptions = IInjectValueOptions | IInjectValueOptions[];


export interface IInjectProps {
  [index: string]: IInjectValueMultiOptions
}

const defaultMapProviderValue: ProviderMap = (provider: Provider<any>) => provider.value;

export const inject = <TInner, TOuter>(properties: IInjectProps | ((props: TOuter) => IInjectProps)) => compose(
  withKernel,
  withProps<TInner, TOuter & IKernelProps>((props) => {
    const propMap = (typeof properties === 'function' ? properties(props) : properties);
    const newProps = {};
    for (const key in propMap) {
      const optionsOrMultiOptions = propMap[key];
      const multi = Array.isArray(optionsOrMultiOptions);
      const optionsOrId = multi ? optionsOrMultiOptions[0] : optionsOrMultiOptions;
      const { id, mapValue = defaultMapProviderValue } = typeof optionsOrId === 'string' ? { id: optionsOrId } : optionsOrId;
      newProps[key] = multi ? props.kernel.queryAll(id).map(mapValue) : mapValue(props.kernel.query(id));
    }
    
    return newProps as TInner;
  })
);

export const withBus = <TInput, TOutput>() => inject<TInput, TOutput>({ bus: PrivateBusProvider.ID });