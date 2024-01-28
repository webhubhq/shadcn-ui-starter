import React, { useCallback } from 'react';
import { Rectangle } from '@/src-isoflow/types';
import { useTheme, Box } from '@mui/material';
import { useSceneStore } from '@/src-isoflow/stores/sceneStore';
import { useRectangle } from '@/src-isoflow/hooks/useRectangle';
import { ColorSelector } from '@/src-isoflow/components/ColorSelector/ColorSelector';
import { useUiStateStore } from '@/src-isoflow/stores/uiStateStore';
import { ControlsContainer } from '../components/ControlsContainer';
import { Section } from '../components/Section';
import { Header } from '../components/Header';
import { DeleteButton } from '../components/DeleteButton';

interface Props {
  id: string;
}

export const RectangleControls = ({ id }: Props) => {
  const theme = useTheme();
  const sceneActions = useSceneStore((state) => {
    return state.actions;
  });
  const uiStateActions = useUiStateStore((state) => {
    return state.actions;
  });
  const rectangle = useRectangle(id);

  const onRectangleUpdated = useCallback(
    (updates: Partial<Rectangle>) => {
      sceneActions.updateRectangle(id, updates);
    },
    [sceneActions, id]
  );

  const onRectangleDeleted = useCallback(() => {
    uiStateActions.setItemControls(null);
    sceneActions.deleteRectangle(id);
  }, [sceneActions, id, uiStateActions]);

  return (
    <ControlsContainer header={<Header title="Rectangle settings" />}>
      <Section>
        <ColorSelector
          colors={Object.values(theme.customVars.diagramPalette)}
          onChange={(color) => {
            return onRectangleUpdated({ color });
          }}
          activeColor={rectangle.color}
        />
      </Section>
      <Section>
        <Box>
          <DeleteButton onClick={onRectangleDeleted} />
        </Box>
      </Section>
    </ControlsContainer>
  );
};
