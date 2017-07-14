import { RootState } from "../state";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { RootComponentProps } from "../components";
import { Dispatcher, Message } from "aerial-common2";

export type Component<P> = React.ComponentClass<P> | React.StatelessComponent<P>

export const reactDispatcher = <TProps extends RootComponentProps>(state: RootState, BaseComponent: Component<TProps>) => (downstream: Dispatcher<any>) => (message: Message) => {
  ReactDOM.render(React.createElement(BaseComponent as React.ComponentClass<any>, { appState: state }), state.element);
  return downstream(message);
}