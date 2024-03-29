import { ModeActions } from '@/src-isoflow/types';
import { produce } from 'immer';
import { generateId, hasMovedTile, setWindowCursor } from '@/src-isoflow/utils';
import { DEFAULT_COLOR } from '@/src-isoflow/config';

export const DrawRectangle: ModeActions = {
  entry: () => {
    setWindowCursor('crosshair');
  },
  exit: () => {
    setWindowCursor('default');
  },
  mousemove: ({ uiState }) => {
    if (
      uiState.mode.type !== 'RECTANGLE.DRAW' ||
      !hasMovedTile(uiState.mouse) ||
      !uiState.mode.area ||
      !uiState.mouse.mousedown
    )
      return;

    const newMode = produce(uiState.mode, (draftState) => {
      if (!draftState.area) return;

      draftState.area.to = uiState.mouse.position.tile;
    });

    uiState.actions.setMode(newMode);
  },
  mousedown: ({ uiState }) => {
    if (uiState.mode.type !== 'RECTANGLE.DRAW') return;

    const newMode = produce(uiState.mode, (draftState) => {
      draftState.area = {
        from: uiState.mouse.position.tile,
        to: uiState.mouse.position.tile
      };
    });

    uiState.actions.setMode(newMode);
  },
  mouseup: ({ uiState, scene, isRendererInteraction }) => {
    if (
      uiState.mode.type !== 'RECTANGLE.DRAW' ||
      !uiState.mode.area ||
      !isRendererInteraction
    )
      return;

    // @ts-ignore
    scene.actions.createRectangle({
      id: generateId(),
      color: DEFAULT_COLOR,
      from: uiState.mode.area.from,
      to: uiState.mode.area.to
    });

    uiState.actions.setMode({
      type: 'CURSOR',
      showCursor: true,
      mousedownItem: null
    });
  }
};
