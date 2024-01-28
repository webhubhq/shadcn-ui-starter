import React, { useCallback } from 'react';
import { Connector, ConnectorStyleEnum } from '@/src-isoflow/types';
import { useTheme, Box, Slider, Select, MenuItem } from '@mui/material';
import { useSceneStore } from '@/src-isoflow/stores/sceneStore';
import { useConnector } from '@/src-isoflow/hooks/useConnector';
import { ColorSelector } from '@/src-isoflow/components/ColorSelector/ColorSelector';
import { useUiStateStore } from '@/src-isoflow/stores/uiStateStore';
import { ControlsContainer } from '../components/ControlsContainer';
import { Section } from '../components/Section';
import { Header } from '../components/Header';
import { DeleteButton } from '../components/DeleteButton';

interface Props {
  id: string;
}

export const ConnectorControls = ({ id }: Props) => {
  const theme = useTheme();
  const sceneActions = useSceneStore((state) => {
    return state.actions;
  });
  const uiStateActions = useUiStateStore((state) => {
    return state.actions;
  });
  const connector = useConnector(id);

  const onConnectorUpdated = useCallback(
    (updates: Partial<Connector>) => {
      sceneActions.updateConnector(id, updates);
    },
    [sceneActions, id]
  );

  const onConnectorDeleted = useCallback(() => {
    uiStateActions.setItemControls(null);
    sceneActions.deleteConnector(id);
  }, [sceneActions, id, uiStateActions]);

  return (
    <ControlsContainer header={<Header title="Connector settings" />}>
      <Section>
        <ColorSelector
          colors={Object.values(theme.customVars.diagramPalette)}
          onChange={(color) => {
            return onConnectorUpdated({ color });
          }}
          activeColor={connector.color}
        />
      </Section>
      <Section title="Width">
        <Slider
          marks
          step={10}
          min={10}
          max={30}
          value={connector.width}
          onChange={(e, newWidth) => {
            onConnectorUpdated({ width: newWidth as number });
          }}
        />
      </Section>
      <Section title="Style">
        <Select
          value={connector.style}
          onChange={(e) => {
            return onConnectorUpdated({
              style: e.target.value as ConnectorStyleEnum
            });
          }}
        >
          {Object.values(ConnectorStyleEnum).map((style) => {
            return <MenuItem value={style}>{style}</MenuItem>;
          })}
        </Select>
      </Section>
      <Section>
        <Box>
          <DeleteButton onClick={onConnectorDeleted} />
        </Box>
      </Section>
    </ControlsContainer>
  );
};
