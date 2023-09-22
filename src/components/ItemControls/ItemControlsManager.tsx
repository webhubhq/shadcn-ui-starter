import React, { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@mui/material';
import { useUiStateStore } from 'src/stores/uiStateStore';
import { IconSelection } from 'src/components/ItemControls/IconSelection/IconSelection';
import { UiElement } from '../UiElement/UiElement';
import { NodeControls } from './NodeControls/NodeControls';
import { ConnectorControls } from './ConnectorControls/ConnectorControls';
import { RectangleControls } from './RectangleControls/RectangleControls';

export const ItemControlsManager = () => {
  const itemControls = useUiStateStore((state) => {
    return state.itemControls;
  });

  const theme = useTheme();

  const Controls = useMemo(() => {
    switch (itemControls?.type) {
      case 'NODE':
        return <NodeControls key={itemControls.id} id={itemControls.id} />;
      case 'CONNECTOR':
        return <ConnectorControls key={itemControls.id} id={itemControls.id} />;
      case 'RECTANGLE':
        return <RectangleControls key={itemControls.id} id={itemControls.id} />;
      case 'ADD_ITEM':
        return <IconSelection />;
      default:
        return null;
    }
  }, [itemControls]);

  const topOffset = useMemo(() => {
    return theme.customVars.appPadding.y * 2 + parseInt(theme.spacing(2), 10);
  }, [theme]);

  const [load, setLoad] = useState(false);


  const content = {
    default: {
      header: 'Welcome to WebHUB Playground',
      description: 'This playground offers a fun and streamlined way of interacting with your backend and deploying your next big application!'
    },
    'my-api': {
      header: 'Nexus',
      description: 'This is the core of your API and powers and connects all of your endpoints in one powerful and exciting place'
    },
    'data-storage': {
      header: 'Data Storage Services',
      description: 'WebHUB offers multiple ways to store your data power by industry leaders'
    },
    'card-terminal': {
      header: 'Payment Services',
      description: 'Integrate payment services for eccomerce and business websites',
    },
    'authentication': {
      header: 'Authentication Services',
      description: 'Integrate authentication for user data',
    },
    'client-endpoints': {
      header: 'Client Endpoints',
      description: 'Connect your API to your front end using our suggest front end integration tutorials',
    },
    'websockets': {
      header: 'Real Time Communication',
      description: 'The power websockets for real time communication at your fingertips, to power your next amazing app.',
    },
    'aws-lambdas': {
      header: 'Execute Code',
      description: 'Run and host important business logic and 3rd party resources on AWS Lambdas',
    },
  };

  // @ts-ignore
  const cnt = content[itemControls?.id] ? content[itemControls?.id] : content.default;


  useEffect(() => {
    setTimeout(() => {
      setLoad(true);
    }, 7500)
  }, [])

  // @ts-ignore
  const card = ({ content, sx = {} }) => <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      padding: '10px 5px',
      marginBottom: 15,
      borderRadius: 10,
      ...sx,
    }}>
    {content}
  </div>

  return (
    <UiElement
      sx={{
        top: topOffset,
        minHeight: `calc(100% - ${
          topOffset + theme.customVars.appPadding.y
        }px)`,
        overflowY: 'scroll',
        '&::-webkit-scrollbar': {
          display: 'none'
        },
        width: '500px',
        transition: 'opacity 0.5s',
        opacity: load ? 1 : 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* {Controls} */}
      <div style={{ display: 'flex', flexDirection: 'column', padding: '30px 30px', flex: 1 }}>
        {card({
          content: <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 10 }}>
              {cnt.header}
            </div>
            <div style={{ fontSize: 16, fontWeight: 'normal' }}>
              {cnt.description}
            </div>
          </div>,
          sx: {
            // background: 'rgba(0, 0, 0, 0.2)',
            // height: 200,
            marginBottom: 20
          },
        })}
        {card({
          content: <div style={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 'bold', opacity: 0.8 }}>
              More information and functionality coming soon!
            </div>
          </div>,
          sx: {
            background: 'rgba(0, 0, 0, 0.2)',
            flex: 1,
            marginBottom: 0,
          },
        })}
      </div>
    </UiElement>
  );
};
