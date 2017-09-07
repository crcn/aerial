import "front-end/scss/index.scss";
import * as React from "react";
import { Gutter } from "./index";

const GutterPreview = (props) => <Gutter>
  <span style={{"position":"relative","left":214,"top":263,"fontSize":32}}>GUTTER!</span>
</Gutter>;

export default GutterPreview;