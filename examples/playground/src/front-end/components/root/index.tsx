import * as React from "react";
import { Event, ImmutableObject, createImmutableObject } from "aerial-common2";
import { RootState } from "../../state";

export type RootComponentProps = ImmutableObject<{
  appState: RootState
}>;

const createRootComponentState = (appState: RootState): RootComponentProps => createImmutableObject({ appState });

export const rootComponentReducer = (props: RootComponentProps, event: Event) => {
  return props;
};

export const RootComponentBase = ({ appState }: RootComponentProps) => <div>
  
</div>;

export const RootComponent = RootComponentBase;

import { zipObject } from "lodash";

/*

const application = (getProvider) => {
  const httpServerProvider = getProvider("httpServer");
}

application((name) => {
  switch(name) {
    case "httpServer": return httpProvider;
  }
});

application((name) => {
  switch(name) {
    case "httpServer": return mockHTTPProvider;
  }
});



*/