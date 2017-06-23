import * as React from "react";
import { Kernel } from "aerial-common";
import { TextEditor } from "../text-editor";
import { withBus, inject } from "../utils";
import { withContext, compose } from "recompose";
import { ComponentProvider, EditorComponentProvider } from "../../providers";

export interface IRootComponentBaseProps {
  kernel: Kernel;
  editorComponents: React.ComponentClass<any>[];
};

const RootComponentBase = ({ kernel, editorComponents }: IRootComponentBaseProps) => {
  return <div>
    {editorComponents.map((EditorComponent, i) => <EditorComponent key={i} />)}
  </div>;
};

const enhanceRootComponent = compose<IRootComponentBaseProps, IRootComponentBaseProps>(
  withContext({
    kernel: React.PropTypes.object
  }, ({ kernel }) => ({ kernel })),
  inject({
    editorComponents: [EditorComponentProvider.getId("**")]
  })
);

export const RootComponent = enhanceRootComponent(RootComponentBase);
