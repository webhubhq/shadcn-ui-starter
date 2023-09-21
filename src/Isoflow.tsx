"use client"

import React, { useEffect, useState, useRef } from 'react';
import $ from "jquery"
import { shallow } from 'zustand/shallow';
import { ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import { theme } from 'src/styles/theme';
import {
  SceneInput,
  IconInput,
  NodeInput,
  ConnectorInput,
  RectangleInput,
  Scene,
  ConnectorStyleEnum,
  InitialData
} from 'src/types';
import { sceneToSceneInput } from 'src/utils';
import { useSceneStore, SceneProvider } from 'src/stores/sceneStore';
import { GlobalStyles } from 'src/styles/GlobalStyles';
import { Renderer } from 'src/components/Renderer/Renderer';
import { LabelContainer } from 'src/components/Nodes/Node/LabelContainer';
import { useWindowUtils } from 'src/hooks/useWindowUtils';
import { sceneInput as sceneValidationSchema } from 'src/validation/scene';
import { EMPTY_SCENE } from 'src/config';
import { UiOverlay } from 'src/components/UiOverlay/UiOverlay';
import { UiStateProvider, useUiStateStore } from 'src/stores/uiStateStore';
import { useScroll } from './hooks/useScroll';

interface Props {
  initialData?: InitialData;
  disableInteractions?: boolean;
  onSceneUpdated?: (scene: SceneInput) => void;
  width?: number | string;
  height?: number | string;
  debugMode?: boolean;
}

const App = ({
  initialData,
  width,
  height = '100%',
  disableInteractions: disableInteractionsProp,
  onSceneUpdated,
  debugMode = false
}: Props) => {
  const previnitialData = useRef<SceneInput>(EMPTY_SCENE);
  const [isReady, setIsReady] = useState(false);

  const [selectedElement, setSelectedElement] = useState<null | object>(null);
  const [scrollTop, setScrollTop] = useState(0);

  useWindowUtils();
  const scene = useSceneStore(({ nodes, connectors, rectangles, icons }) => {
    return { nodes, connectors, rectangles, icons };
  }, shallow);
  const sceneActions = useSceneStore((state) => {
    return state.actions;
  });
  const uiActions = useUiStateStore((state) => {
    return state.actions;
  });

  const uiItemControls = useUiStateStore((state) => {
    return state.itemControls;
  });

  const { scrollToTile } = useScroll();

  useEffect(() => {
    console.log('uiItemControls 1: ', uiItemControls)
    setSelectedElement(uiItemControls)

    if (uiItemControls?.node?.position) {
      scrollToTile(uiItemControls?.node?.position)
    }

    if (uiItemControls === null) {
      setScrollTop(0)
    } else if (scrollTop < 40){

      setScrollTop(50);
    }
  }, [uiItemControls])

  useEffect(() => {
    uiActions.setZoom(initialData?.zoom ?? 1);
    uiActions.setDisableInteractions(Boolean(disableInteractionsProp));
  }, [initialData?.zoom, disableInteractionsProp, sceneActions, uiActions]);

  useEffect(() => {
    if (!initialData || previnitialData.current === initialData) return;

    previnitialData.current = initialData;
    sceneActions.setScene(initialData);
    setIsReady(true);
  }, [initialData, sceneActions]);

  useEffect(() => {
    if (!isReady || !onSceneUpdated) return;

    const sceneInput = sceneToSceneInput(scene);
    onSceneUpdated(sceneInput);
  }, [scene, onSceneUpdated, isReady]);

  useEffect(() => {
    uiActions.setDebugMode(debugMode);
  }, [debugMode, uiActions]);

  // useEffect(() => {
  //   console.log('scrollTop: ', scrollTop)
  // }, [scrollTop])

  useEffect(() => {
  //   $('#content-container').mousewheel(function(event, delta) {
  //     event.preventDefault();
  //     console.log('delta: ', delta)
  //  });

   $('#content-container').bind('mousewheel', function(e){
      console.log('window: ', window.innerHeight);
      const dy = e?.originalEvent?.wheelDelta || 0
      if(dy / 120 > 0) {
        console.log('scrolling up: ', dy);
        const vh = dy / window.innerHeight;
        setScrollTop((prevState) => (prevState - vh) < 40 ? 40 : prevState - vh)
      }
      else{
        console.log('scrolling down: ', dy);
        const vh = dy / window.innerHeight;
        setScrollTop((prevState) => (prevState - vh) > 100 ? 100 : prevState - vh)
      }
    });

  });

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflowY: 'hidden' }}>
      <GlobalStyles />
      <Box
        sx={{
          width: width ?? '100%',
          height,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Renderer />
        <UiOverlay />
      </Box>
      {/* <div id="content-container" style={{ transition: 'all 0.5s', position: 'absolute', top: `calc(100vh - ${scrollTop}vh)`, left: 0, width: '100%', minHeight: '100%', backgroundColor: 'white' }}>
        <img src="assets/bg-img-6.png" width="100%" />
      </div> */}
    </div>
  );
};

export const Isoflow = (props: Props) => {
  return (
    <ThemeProvider theme={theme}>
      <SceneProvider>
        <UiStateProvider>
          <App {...props} />
        </UiStateProvider>
      </SceneProvider>
    </ThemeProvider>
  );
};

const useIsoflow = () => {
  const updateNode = useSceneStore((state) => {
    return state.actions.updateNode;
  });

  return {
    updateNode
  };
};

export default Isoflow;

export {
  InitialData,
  Scene,
  SceneInput,
  IconInput,
  NodeInput,
  RectangleInput,
  ConnectorInput,
  useIsoflow,
  LabelContainer,
  sceneValidationSchema,
  ConnectorStyleEnum
};
