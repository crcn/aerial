import "./index.scss";
import * as React from "react";

export const GutterBase = ({ children }) => <div className="gutter">
  { children }
</div>;

export const Gutter = GutterBase;