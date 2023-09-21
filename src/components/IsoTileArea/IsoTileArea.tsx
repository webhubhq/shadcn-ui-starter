import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import { UNPROJECTED_TILE_SIZE } from 'src/config';
import { Size, Coords, TileOriginEnum } from 'src/types';
import {
  getIsoMatrixCSS,
  getProjectedTileSize,
  getBoundingBox
} from 'src/utils';
import { Svg } from 'src/components/Svg/Svg';
import { useGetTilePosition } from 'src/hooks/useGetTilePosition';


import "@/styles/g.css"

interface Props {
  from: Coords;
  to: Coords;
  origin?: Coords;
  fill: string;
  cornerRadius?: number;
  stroke?: {
    width: number;
    color: string;
  };
  zoom: number;
  outline: string;
  label: string;
  isCursor?: boolean;
  children?: React.ReactNode;
}

export const IsoTileArea = ({
  from,
  to,
  origin: _origin,
  fill,
  cornerRadius = 0,
  stroke,
  zoom,
  outline = "none",
  label = "",
  isCursor = false,
  children
}: Props) => {
  const { getTilePosition } = useGetTilePosition();
  const projectedTileSize = useMemo(() => {
    return getProjectedTileSize({ zoom });
  }, [zoom]);

  const size = useMemo(() => {
    return {
      width: Math.abs(from.x - to.x) + 1,
      height: Math.abs(from.y - to.y) + 1
    };
  }, [from, to]);

  const origin = useMemo(() => {
    if (_origin) return _origin;

    const boundingBox = getBoundingBox([from, to]);

    return boundingBox[2];
  }, [from, to, _origin]);

  const position = useMemo(() => {
    return getTilePosition({
      tile: origin,
      origin: TileOriginEnum.TOP
    });
  }, [origin, getTilePosition]);

  const viewbox = useMemo<Size>(() => {
    return {
      width: (size.width / 2 + size.height / 2) * projectedTileSize.width,
      height: (size.width / 2 + size.height / 2) * projectedTileSize.height
    };
  }, [size, projectedTileSize]);

  const translate = useMemo<Coords>(() => {
    return { x: size.width * (projectedTileSize.width / 2), y: 0 };
  }, [size, projectedTileSize]);

  const strokeParams = useMemo(() => {
    if (!stroke) return {};

    return {
      stroke: stroke.color,
      strokeWidth: stroke.width
    };
  }, [stroke]);

  const marginLeft = useMemo(() => {
    return -(size.width * projectedTileSize.width * 0.5);
  }, [projectedTileSize.width, size.width]);

  const w = size.width * UNPROJECTED_TILE_SIZE * zoom;
  const h = size.height * UNPROJECTED_TILE_SIZE * zoom;

  return (
    <Box
      sx={{
        transition: !isCursor && 'all 1s',
        position: 'absolute',
        marginLeft: `${marginLeft}px`,
        left: position.x,
        top: position.y
      }}
    >
      <Svg
        viewBox={`0 0 ${viewbox.width} ${viewbox.height}`}
        width={`${viewbox.width}px`}
        height={`${viewbox.height}px`}
        onMouseOut={() => {
          return console.log('mouse out');
        }}
        onMouseEnter={() => {
          return console.log('mouse enter');
        }}
        onMouseLeave={() => {
          return console.log('mouse enter');
        }}
      >
        <g transform={`translate(${translate.x}, ${translate.y})`}>
          <g transform={getIsoMatrixCSS()}>
            {/* <rect
              width={size.width * UNPROJECTED_TILE_SIZE * zoom + 3}
              height={size.height * UNPROJECTED_TILE_SIZE * zoom + 3}
              class="outline"
              stroke="#ffffff"
              stroke-width="14"
              fill="none"
              fill-rule="evenodd"
            /> */}
            <rect
              width={size.width * UNPROJECTED_TILE_SIZE * zoom}
              height={size.height * UNPROJECTED_TILE_SIZE * zoom}
              fill={fill}
              rx={cornerRadius}
              {...strokeParams}
              onMouseEnter={() => {
                return console.log('mouse enter');
              }}
              onMouseLeave={() => {
                return console.log('mouse enter');
              }}
            />
            {(outline === 'active' || outline === 'static') && <polygon
              className={`path-${outline}`}
              points={`0 0, ${w} 0, ${w} ${h}, 0 ${h}`}
              stroke={strokeParams.stroke || '#fff000'}
              stroke-width="4"
              fill="none" 
              fill-rule="evenodd"
            />}
            {children}
          </g>
          {label && label.length > 0 && <g transform={`matrix(0.707, 0.409, -0.707, 0.409, 0, -0.816)`}>
            <text x={`${10 * zoom}`} y={`${35 * zoom}`} style={{ fontSize: 28 * zoom, fontWeight: 'bold', transform: 'rotate(0deg)', fill: strokeParams.stroke }}>{label}</text>
          </g>}
        </g>
      </Svg>
    </Box>
  );
};
