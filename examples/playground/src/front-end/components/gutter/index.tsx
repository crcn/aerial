import "./index.scss";
import * as React from "react";

export const GutterComponentBase = ({ children }) => <div className="gutter">
  { children }
</div>;

export const GutterComponent = GutterComponentBase;