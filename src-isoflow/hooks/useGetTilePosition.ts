import { useCallback } from 'react';
import { useUiStateStore } from '@/src-isoflow/stores/uiStateStore';
import { Coords, TileOriginEnum } from '@/src-isoflow/types';
import { getTilePosition as getTilePositionUtil } from '@/src-isoflow/utils';

export const useGetTilePosition = () => {
  const { scroll, zoom, rendererSize } = useUiStateStore((state) => {
    return {
      scroll: state.scroll,
      zoom: state.zoom,
      rendererSize: state.rendererSize
    };
  });

  const getTilePosition = useCallback(
    ({ tile, origin }: { tile: Coords; origin?: TileOriginEnum }) => {
      return getTilePositionUtil({
        tile,
        scroll,
        zoom,
        origin,
        rendererSize
      });
    },
    [scroll, zoom, rendererSize]
  );

  return { getTilePosition };
};
