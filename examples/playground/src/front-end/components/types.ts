import * as React from "react";

export type Component<TProps> = React.Component<TProps, any> | React.StatelessComponent<TProps>;