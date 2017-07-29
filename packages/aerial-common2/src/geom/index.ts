// import { getV } from "../struct";
import { weakMemo } from "../memo";

export type Box = {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export type Size = {
  width: number;
  height: number;
};

export type Boxed = {
  box: Box
};

export type Rectangle = {
  width: number;
  height: number;
}

export type Point = {
  left: number;
  top: number;
};

export type Translate = {
  left: number;
  top: number;
  zoom: number;
};

export const createBox = (left: number, right: number, top: number, bottom: number): Box => ({
  left,
  right,
  top, 
  bottom
});

export const moveBox = (box: Box, { left, top }: Point): Box => ({
  ...box,
  left: left,
  top: top,
  right: left + box.right - box.left,
  bottom: top + box.bottom - box.top
});

export const zoomBox = (box: Box, zoom: number): Box => ({
  ...box,
  left: box.left * zoom,
  top: box.top * zoom,
  right: box.right * zoom,
  bottom: box.bottom * zoom
});

export const boxFromRect = ({ width, height }: Rectangle): Box => ({
  left: 0,
  top: 0,
  right: width,
  bottom: height
});

export const getBoxWidth  = (box: Box) => box.right - box.left;
export const getBoxHeight = (box: Box) => box.bottom - box.top;
export const getBoxSize   = weakMemo((box: Box): Size => ({
  width: getBoxWidth(box),
  height: getBoxHeight(box)
}));

export const scaleInnerBox = (inner: Box, oldBounds: Box, newBounds: Box): Box => {

  const oldBoundsSize = getBoxSize(oldBounds);
  const newBoundsSize = getBoxSize(newBounds);
  const innerBoundsSize = getBoxSize(inner);

  const percLeft   = (inner.left - oldBounds.left) / oldBoundsSize.width;
  const percTop    = (inner.top  - oldBounds.top)  / oldBoundsSize.height;
  const percWidth  = innerBoundsSize.width / oldBoundsSize.width;
  const percHeight = innerBoundsSize.height / oldBoundsSize.height;

  const left   = newBounds.left + newBoundsSize.width * percLeft;
  const top    = newBounds.top  + newBoundsSize.height * percTop;
  const right  = left + newBoundsSize.width * percWidth;
  const bottom = top + newBoundsSize.height * percHeight;

  return {
    left,
    top,
    right,
    bottom
  };
};

export const isBox = (box: any) => box && box.left != null && box.top != null && box.right != null && box.bottom != null;
export const filterBoxed = (values: any[]): Boxed[] => values.filter(value => isBox(value.box));

export const mergeBoxes = (...boxes: Box[]) => {
  let left   = Infinity;
  let bottom = -Infinity;
  let top    = Infinity;
  let right  = -Infinity;

  for (const box of boxes) {
    left   = Math.min(left, box.left);
    right  = Math.max(right, box.right);
    top    = Math.min(top, box.top);
    bottom = Math.max(bottom, box.bottom);
  }

  return createBox(left, right, top, bottom);
}

export const centerTransformZoom = (translate: Translate, box: Box, nz: number, point?: Point): Translate => {
  const oz = translate.zoom;

  const zd   = (nz / oz);

  const v1w  = box.right - box.left;
  const v1h  = box.bottom - box.top;

  // center is based on the mouse position
  const v1px = point ? point.left / v1w : 0.5;
  const v1py = point ? point.top / v1h : 0.5;

  // calculate v1 center x & y
  const v1cx = v1w * v1px;
  const v1cy = v1h * v1py;

  // old screen width & height
  const v2ow = v1w * oz;
  const v2oh = v1h * oz;

  // old offset pane left
  const v2ox = translate.left;
  const v2oy = translate.top;

  // new width of view 2
  const v2nw = v1w * nz;
  const v2nh = v1h * nz;

  // get the offset px & py of view 2
  const v2px = (v1cx - v2ox) / v2ow;
  const v2py = (v1cy - v2oy) / v2oh;

  const left = v1w * v1px - v2nw * v2px;
  const top  = v1h * v1py - v2nh * v2py;

  return {
    left: left,
    top: top,
    zoom: nz
  };
};