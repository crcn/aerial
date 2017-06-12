import React =  require("react");
import { IDispatcher, IBus } from "@tandem/mesh";
import { inject, loggable } from "@tandem/common/decorators";
import {
  Kernel,
  IInjectable,
  PrivateBusProvider,
  KernelProvider,
} from "@tandem/common/ioc";
import {
  Logger
} from "@tandem/common/logger";

export interface IApplicationComponentContext {
  bus: IBus<any>;
  kernel: Kernel;
}

export const appComponentContextTypes = {
  bus: React.PropTypes.object,
  kernel: React.PropTypes.object
};

@loggable()
export class BaseApplicationComponent<T, U> extends React.Component<T, U> implements IInjectable {

  protected readonly logger: Logger;

  static contextTypes = appComponentContextTypes;

  @inject(PrivateBusProvider.ID)
  protected readonly bus: IBus<any>;

  @inject(KernelProvider.ID)
  protected readonly kernel: Kernel

  constructor(props: T, context: IApplicationComponentContext) {
    super(props, context);

    if (context.kernel) {
      context.kernel.inject(this);
    } else {
      console.warn(`Failed to inject properties into `, this.constructor.name);
    }
  }

  $didInject() {

  }
}

export class RootApplicationComponent extends React.Component<IApplicationComponentContext, {}> implements IInjectable {

  static childContextTypes = appComponentContextTypes;

  getChildContext() {
    return {
      bus: this.props.bus,
      kernel: this.props.kernel
    };
  }

  render() {
    return <span>{ this.props.children } </span>;
  }
}