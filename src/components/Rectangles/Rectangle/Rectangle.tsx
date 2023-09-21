import React from 'react';
import { Coords } from 'src/types';
import { IsoTileArea } from 'src/components/IsoTileArea/IsoTileArea';
import { useUiStateStore } from 'src/stores/uiStateStore';
import { getColorVariant } from 'src/utils';

interface Props {
  from: Coords;
  to: Coords;
  color: string;
  label: string;
}

export const Rectangle = ({ from, to, color, label = "" }: Props) => {
  const tile = useUiStateStore((state) => {
    return state.mouse.position.tile;
  });

  const zoom = useUiStateStore((state) => {
    return state.zoom;
  });

  const isCursorInRectangle = () => {
    const x1 = tile.x > from.x;
    const x2 = tile.x > to.x
    const y1 = tile.y > from.y;
    const y2 = tile.y > to.y;

    if (x1 !== x2 && y1 !== y2) {
      return true
    }

    const x3 = tile.x === from.x;
    const x4 = tile.x === to.x;
    const y3 = tile.y === from.y;
    const y4 = tile.y === to.y;

    return x3 && y1 !== y2 || x4 && y1 !== y2 || y3 && x1 !== x2 || y4 && x1 !== x2 || x3 && y3 || x4 && y4 || x3 && y4 || x4 && y3
  };

  return (
    <IsoTileArea
      from={from}
      to={to}
      fill={color}
      zoom={zoom}
      cornerRadius={22 * zoom}
      stroke={{
        color: getColorVariant(color, 'dark', { grade: 2 }),
        width: 1 * zoom
      }}
      outline={isCursorInRectangle() ? 'active' : 'none'}
      label={label}
    />
  );
};
