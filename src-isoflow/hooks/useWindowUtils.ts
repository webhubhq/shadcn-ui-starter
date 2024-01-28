import { useEffect } from 'react';
import { useSceneStore } from '@/src-isoflow/stores/sceneStore';
import { useDiagramUtils } from '@/src-isoflow/hooks/useDiagramUtils';

export const useWindowUtils = () => {
  const scene = useSceneStore(({ nodes, rectangles, connectors, icons }) => {
    return {
      nodes,
      rectangles,
      connectors,
      icons
    };
  });
  const sceneActions = useSceneStore(({ actions }) => {
    return actions;
  });
  const { fitProjectToScreen, getUnprojectedBounds } = useDiagramUtils();

  useEffect(() => {
    window.Isoflow = {
      getUnprojectedBounds,
      fitProjectToScreen,
      setScene: sceneActions.setScene
    };
  }, [getUnprojectedBounds, fitProjectToScreen, scene, sceneActions]);
};
