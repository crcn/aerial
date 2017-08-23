import "./grid.scss";

import React =  require("react");
import { Translate } from "aerial-common2";
import { pure, compose } from "recompose";
import { Workspace, Stage } from "front-end/state";

export type GridStageToolProps = {
  translate: Translate;
};

export const GridStageToolBase = ({ translate }: GridStageToolProps) => {
  if (translate.zoom <= 12) return null;

  const size = 20000;
  const gridSize = 1;
  const paths = [

    // horizontal
    [[0, 0], [gridSize, 0]],

    // vertical
    [[0, 0], [0, gridSize]]
  ];

  return <div className="m-grid-tool" style={{left: -size / 2, top: -size / 2 }}>
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>

      <defs>
        <pattern id="grid" width={gridSize / size} height={gridSize / size}>
          <g stroke="#d8d8d8">
            {
              paths.map(([[sx, sy], [ex, ey]], i) => {
                return <path strokeWidth={1 / translate.zoom} key={i} d={`M${sx},${sy} L${ex},${ey}`}></path>;
              })
            }
          </g>
        </pattern>
      </defs>
      <rect fill="url(#grid)" width={size} height={size} />
    </svg>
  </div>;
};

export const GridStageTool = compose<GridStageToolProps, GridStageToolProps>(
  pure
)(GridStageToolBase);