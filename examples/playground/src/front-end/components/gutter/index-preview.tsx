import "front-end/scss/index.scss";
import * as React from "react";
import { Gutter } from "./index";

const GutterPreview = (props) => <Gutter>
  <span style={{"position":"relative","left":134,"top":141,"fontSize":32, color: "red"}}>GUTTER</span>
</Gutter>;

export default GutterPreview;