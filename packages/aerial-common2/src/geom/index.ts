// import { getV } from "../struct";
import { weakMemo } from "../memo";

export type Bounds = {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export type Size = {
  width: number;
  height: number;
};

export type Bounded = {
  box: Bounds
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

export const createBounds = (left: number, right: number, top: number, bottom: number): Bounds => ({
  left,
  right,
  top, 
  bottom
});

export const moveBounds = (box: Bounds, { left, top }: Point): Bounds => ({
  ...box,
  left: left,
  top: top,
  right: left + box.right - box.left,
  bottom: top + box.bottom - box.top
});

export const shiftPoint = (point: Point, delta: Point) => ({
  left: point.left + delta.left,
  top: point.top + delta.top
});

export const shiftBounds = (box: Bounds, { left, top }: Point): Bounds => ({
  ...box,
  left: box.left + left,
  top: box.top + top,
  right: box.right + left,
  bottom: box.bottom + top
});

export const keepBoundsAspectRatio = (newBounds: Bounds, oldBounds: Bounds, anchor: Point, centerPoint = anchor): Bounds => {
  const newBoundsSize = getBoundsSize(newBounds);
  const oldBoundsSize = getBoundsSize(oldBounds);
  
  let left   = newBounds.left;
  let top    = newBounds.top;
  let width  = newBoundsSize.width;
  let height = newBoundsSize.height;

  if (anchor.top === 0 || anchor.top === 1) {
    const perc = height / oldBoundsSize.height;
    width = oldBoundsSize.width * perc;
    left = oldBounds.left + (oldBoundsSize.width - width) * (1 - centerPoint.left);
  } else if (anchor.top === 0.5) {
    const perc = width / oldBoundsSize.width;
    height = oldBoundsSize.height * perc;
    top = oldBounds.top + (oldBoundsSize.height - height) * (1 - centerPoint.top);
  }

  return {
    left: left,
    top: top,
    right: left + width,
    bottom: top + height
  }
};
export const keepBoundsCenter = (newBounds: Bounds, oldBounds: Bounds, anchor: Point): Bounds => {
  const newBoundsSize = getBoundsSize(newBounds);
  const oldBoundsSize = getBoundsSize(oldBounds);
  
  let left   = oldBounds.left;
  let top    = oldBounds.top;
  let width  = oldBoundsSize.width;
  let height = oldBoundsSize.height;
  const delta = { left: newBounds.left - oldBounds.left, top: newBounds.top - oldBounds.top };

  if (anchor.top === 0) {
    top += delta.top;
    height += delta.top;
    height = oldBounds.top - newBounds.top;
  }

  if (anchor.top === 1) {
    const hdiff = oldBoundsSize.height - newBoundsSize.height;
    top += hdiff;
    height -= hdiff;
  }

  if (anchor.left === 0) {
    left += delta.left;
    top += delta.top;
    width += oldBounds.left - newBounds.left;
  }

  if (anchor.left === 1) {
    width += delta.left;
    const wdiff = oldBoundsSize.width - newBoundsSize.width;
    left += wdiff;
    width -= wdiff;
  }

  return {
    left: left,
    top: top,
    right: left + width,
    bottom: top + height
  }
};

export const zoomBounds = (box: Bounds, zoom: number): Bounds => ({
  ...box,
  left: box.left * zoom,
  top: box.top * zoom,
  right: box.right * zoom,
  bottom: box.bottom * zoom
});

export const boxFromRect = ({ width, height }: Rectangle): Bounds => ({
  left: 0,
  top: 0,
  right: width,
  bottom: height
});

export const getBoundsWidth  = (box: Bounds) => box.right - box.left;
export const getBoundsHeight = (box: Bounds) => box.bottom - box.top;
export const getBoundsSize   = weakMemo((box: Bounds): Size => ({
  width: getBoundsWidth(box),
  height: getBoundsHeight(box)
}));

export const scaleInnerBounds = (inner: Bounds, oldBounds: Bounds, newBounds: Bounds): Bounds => {

  const oldBoundsSize = getBoundsSize(oldBounds);
  const newBoundsSize = getBoundsSize(newBounds);
  const innerBoundsSize = getBoundsSize(inner);

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

export const isBounds = (box: any) => box && box.left != null && box.top != null && box.right != null && box.bottom != null;
export const filterBounded = (values: any[]): Bounded[] => values.filter(value => isBounds(value.box));

export const mergeBounds = (...boxes: Bounds[]) => {
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

  return createBounds(left, right, top, bottom);
}

export const centerTransformZoom = (translate: Translate, box: Bounds, nz: number, point?: Point): Translate => {
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

export const boxesIntersect = (a: Bounds, b: Bounds) => !(a.left > b.right || a.right < b.left || a.top > b.bottom || a.bottom < a.top);
export const pointIntersectsBounds = (point: Point, box: Bounds) => !(point.left < box.left || point.left > box.right || point.top < box.top || point.top > box.bottom);
export const getSmallestBounds = (...boxes: Bounds[]) => boxes.reduce((a, b) => {
  const asize = getBoundsSize(a);
  const bsize = getBoundsSize(b);
  return asize.width * asize.height < bsize.width * bsize.height ? a : b;
}, { left: Infinity, right: Infinity, top: Infinity, bottom: Infinity });