import { InitialData, ConnectorStyleEnum } from 'src/Isoflow';
import { basicIsopack, networkingIsopack, mergeIsopacks } from '../isopacks';
import { customVars } from '../styles/theme';

const mergedIsopacks = mergeIsopacks([basicIsopack, networkingIsopack]);

console.log('mergedIsopacks: ', mergedIsopacks)

export const initialData: InitialData = {
  zoom: 0.5,
  icons: mergedIsopacks,
  nodes: [
    {
      id: 'my-api',
      iconId: 'vm',
      label: 'Nexus',
      position: {
        x: 0,
        y: 0
      }
    },
    {
      id: 'authentication',
      iconId: 'lock',
      label: 'Authentication',
      // labelHeight: 100,
      position: {
        x: 6,
        y: 3
      }
    },
    {
      id: 'card-terminal',
      iconId: 'cardterminal',
      label: 'Payment',
      // labelHeight: 100,
      position: {
        x: 6,
        y: -2
      }
    },
    {
      id: 'data-storage',
      iconId: 'storage',
      label: 'Data Storage',
      // labelHeight: 100,
      position: {
        x: 0,
        y: -6
      },
      color: customVars.diagramPalette.blue
    },
    {
      id: 'aws-lambdas',
      iconId: 'server',
      label: 'Execute Code',
      // labelHeight: 100,
      position: {
        x: -6,
        y: -3
      }
    },
    {
      id: 'websockets',
      iconId: 'cache',
      label: 'Real Time Connections',
      // labelHeight: 100,
      position: {
        x: -6,
        y: 5
      }
    },
    {
      id: 'client-endpoints',
      iconId: 'desktop',
      label: 'Clients',
      // labelHeight: 100,
      position: {
        x: 0,
        y: 6
      }
    },
    {
      id: 'webflow',
      iconId: 'block',
      label: 'Webflow',
      // labelHeight: 100,
      position: {
        x: 0,
        y: 11
      }
    },
    {
      id: 'react-nextjs',
      iconId: 'block',
      label: 'React Next.js',
      // labelHeight: 100,
      position: {
        x: -3,
        y: 11
      }
    },
    {
      id: 'wix',
      iconId: 'block',
      label: 'Wix',
      // labelHeight: 100,
      position: {
        x: 3,
        y: 11
      }
    },
    {
      id: 'websocket-block',
      iconId: 'block',
      label: '',
      // labelHeight: 100,
      position: {
        x: -11,
        y: 5
      }
    },
    {
      id: 'lambda-1',
      iconId: 'block',
      label: '',
      // labelHeight: 100,
      position: {
        x: -11,
        y: 0
      }
    },
    {
      id: 'lambda-2',
      iconId: 'block',
      label: '',
      // labelHeight: 100,
      position: {
        x: -13,
        y: -3
      }
    },
    {
      id: 'lambda-3',
      iconId: 'block',
      label: '',
      // labelHeight: 100,
      position: {
        x: -11,
        y: -6
      }
    },
    {
      id: 'aws-s3-bucket',
      iconId: 'block',
      label: '',
      // labelHeight: 100,
      position: {
        x: -5,
        y: -11
      }
    },
    {
      id: 'dynamodb-3',
      iconId: 'block',
      label: '',
      // labelHeight: 100,
      position: {
        x: 8,
        y: -11
      }
    },
    {
      id: 'dynamodb-2',
      iconId: 'block',
      label: '',
      // labelHeight: 100,
      position: {
        x: 3,
        y: -11
      }
    },
    {
      id: 'dynamodb-1',
      iconId: 'block',
      label: '',
      // labelHeight: 100,
      position: {
        x: 5,
        y: -15
      }
    },
    {
      id: 'stripe-api-payment',
      iconId: 'block',
      label: '',
      position: {
        x: 11,
        y: -2
      }
    },
    {
      id: 'google-oauthentication',
      iconId: 'block',
      label: '',
      position: {
        x: 11,
        y: 3
      }
    }
  ],
  connectors: [
    {
      id: '1',
      style: ConnectorStyleEnum.DASHED,
      width: 10,
      anchors: [{ nodeId: 'client-endpoints' }, { nodeId: 'wix' }],
      color: customVars.diagramPalette.grey
    },
    {
      id: '2',
      style: ConnectorStyleEnum.DASHED,
      width: 10,
      anchors: [{ nodeId: 'client-endpoints' }, { nodeId: 'webflow' }],
      color: customVars.diagramPalette.grey
    },
    {
      id: '3',
      style: ConnectorStyleEnum.DASHED,
      width: 10,
      anchors: [{ nodeId: 'client-endpoints' }, { nodeId: 'react-nextjs' }],
      color: customVars.diagramPalette.grey
    },
    {
      id: '4',
      style: ConnectorStyleEnum.DASHED,
      width: 10,
      anchors: [{ nodeId: 'websockets' }, { nodeId: 'websocket-block' }],
      color: customVars.diagramPalette.yellow
    },
    {
      id: '5',
      style: ConnectorStyleEnum.DASHED,
      width: 10,
      anchors: [{ nodeId: 'aws-lambdas' }, { nodeId: 'lambda-1' }],
      color: customVars.diagramPalette.grey
    },
    {
      id: '6',
      style: ConnectorStyleEnum.DASHED,
      width: 10,
      anchors: [{ nodeId: 'aws-lambdas' }, { nodeId: 'lambda-2' }],
      color: customVars.diagramPalette.grey
    },
    {
      id: '7',
      style: ConnectorStyleEnum.DASHED,
      width: 10,
      anchors: [{ nodeId: 'aws-lambdas' }, { nodeId: 'lambda-3' }],
      color: customVars.diagramPalette.grey
    },
    {
      id: '8',
      style: ConnectorStyleEnum.DASHED,
      width: 10,
      anchors: [{ nodeId: 'data-storage' }, { nodeId: 'aws-s3-bucket' }],
      color: customVars.diagramPalette.grey
    },
    {
      id: '9',
      style: ConnectorStyleEnum.DASHED,
      width: 10,
      anchors: [{ nodeId: 'data-storage' }, { nodeId: 'dynamodb-1' }],
      color: customVars.diagramPalette.grey
    },
    {
      id: '10',
      style: ConnectorStyleEnum.DASHED,
      width: 10,
      anchors: [{ nodeId: 'data-storage' }, { nodeId: 'dynamodb-2' }],
      color: customVars.diagramPalette.grey
    },
    {
      id: '11',
      style: ConnectorStyleEnum.DASHED,
      width: 10,
      anchors: [{ nodeId: 'data-storage' }, { nodeId: 'dynamodb-3' }],
      color: customVars.diagramPalette.grey
    },
    {
      id: '12',
      style: ConnectorStyleEnum.DASHED,
      width: 10,
      anchors: [{ nodeId: 'card-terminal' }, { nodeId: 'stripe-api-payment' }],
      color: customVars.diagramPalette.grey
    },
    {
      id: '13',
      style: ConnectorStyleEnum.DASHED,
      width: 10,
      anchors: [
        { nodeId: 'authentication' },
        { nodeId: 'google-oauthentication' }
      ],
      color: customVars.diagramPalette.grey
    },
    {
      id: '14',
      style: ConnectorStyleEnum.DASHED,
      width: 10,
      anchors: [{ nodeId: 'my-api' }, { nodeId: 'card-terminal' }],
      color: customVars.diagramPalette.grey
    },
    {
      id: '15',
      style: ConnectorStyleEnum.DASHED,
      width: 10,
      anchors: [{ nodeId: 'my-api' }, { nodeId: 'authentication' }],
      color: customVars.diagramPalette.grey
    },
    {
      id: '16',
      style: ConnectorStyleEnum.DASHED,
      width: 10,
      anchors: [{ nodeId: 'my-api' }, { nodeId: 'client-endpoints' }],
      color: customVars.diagramPalette.grey
    },
    {
      id: '17',
      style: ConnectorStyleEnum.DASHED,
      width: 10,
      anchors: [{ nodeId: 'my-api' }, { nodeId: 'websockets' }],
      color: customVars.diagramPalette.grey
    },
    {
      id: '18',
      style: ConnectorStyleEnum.SOLID,
      width: 10,
      anchors: [{ nodeId: 'my-api' }, { nodeId: 'aws-lambdas' }],
      color: customVars.diagramPalette.grey
    },
    {
      id: '19',
      style: ConnectorStyleEnum.DASHED,
      width: 10,
      anchors: [{ nodeId: 'my-api' }, { nodeId: 'data-storage' }],
      color: customVars.diagramPalette.grey
    }
  ],
  rectangles: [
    {
      id: 'core-api-group',
      color: customVars.diagramPalette.grey,
      from: {
        x: -7,
        y: -7
      },
      to: {
        x: 7,
        y: 7
      },
      label: 'Core API'
    },
    {
      id: 'aws-s3-bucket-group',
      color: customVars.diagramPalette.blue,
      from: {
        x: -4,
        y: -10
      },
      to: {
        x: -6,
        y: -12
      },
      label: 'AWS S3 Bucket'
    },
    {
      id: 'aws-dynamodb-group',
      color: customVars.diagramPalette.blue,
      from: {
        x: 2,
        y: -10
      },
      to: {
        x: 9,
        y: -16
      },
      label: 'AWS DynamoDB'
    },
    {
      id: 'aws-lambda-group',
      color: customVars.diagramPalette.orange,
      from: {
        x: -10,
        y: 1
      },
      to: {
        x: -14,
        y: -7
      },
      label: 'AWS Lambda'
    },
    {
      id: 'aws-websockets-group',
      color: customVars.diagramPalette.yellow,
      from: {
        x: -10,
        y: 4
      },
      to: {
        x: -12,
        y: 6
      },
      label: 'AWS Websockets'
    },
    {
      id: 'endpoint-clients',
      color: customVars.diagramPalette.torquise,
      from: {
        x: -4,
        y: 10
      },
      to: {
        x: 4,
        y: 12
      },
      label: 'Endpoint Clients'
    },
    {
      id: 'google-oauth-group',
      color: customVars.diagramPalette.green,
      from: {
        x: 12,
        y: 4
      },
      to: {
        x: 10,
        y: 2
      },
      label: 'Google Auth'
    },
    {
      id: 'stripe-group',
      color: customVars.diagramPalette.yellow,
      from: {
        x: 12,
        y: -1
      },
      to: {
        x: 10,
        y: -3
      },
      label: 'Stripe API'
    },
    // My API Highlight
    {
      id: 'api-highlight',
      color: customVars.diagramPalette.grey,
      from: {
        x: 0.25,
        y: 0.25
      },
      to: {
        x: -0.25,
        y: -0.25
      },
    },
    // Websocket Highlight
    {
      id: 'websocket-highlight',
      color: customVars.diagramPalette.grey,
      from: {
        x: -6.25,
        y: 5.25
      },
      to: {
        x: -5.75,
        y: 4.75
      }
    },
    // AWS Lambdas Highlight
    {
      id: 'lambda-highlight',
      color: customVars.diagramPalette.grey,
      from: {
        x: -6.25,
        y: -3.25
      },
      to: {
        x: -5.75,
        y: -2.75
      }
    },
    // Database Highlight
    {
      id: 'database-highlight',
      color: customVars.diagramPalette.grey,
      from: {
        x: -0.25,
        y: -5.75
      },
      to: {
        x: 0.25,
        y: -6.25
      }
    },
    // Clients Highlight
    {
      id: 'clients-highlight',
      color: customVars.diagramPalette.grey,
      from: {
        x: -0.25,
        y: 5.75
      },
      to: {
        x: 0.25,
        y: 6.25
      }
    },
    // Google OAuth Highlight
    {
      id: 'google-oauth-highlight',
      color: customVars.diagramPalette.grey,
      from: {
        x: 5.75,
        y: 2.75
      },
      to: {
        x: 6.25,
        y: 3.25
      }
    },
    // Stripe Payment Highlight
    {
      id: 'stripe-payment-highlight',
      color: customVars.diagramPalette.grey,
      from: {
        x: 5.75,
        y: -1.75
      },
      to: {
        x: 6.25,
        y: -2.25
      }
    },
    // Google OAuthentication Block
    {
      id: 'google-oauth-block-highlight',
      color: customVars.diagramPalette.grey,
      from: {
        x: 10.75,
        y: 2.75
      },
      to: {
        x: 11.25,
        y: 3.25
      }
    },
    // Stripe Payment API Block Highlight
    {
      id: 'stripe-payment-block-highlight',
      color: customVars.diagramPalette.grey,
      from: {
        x: 10.75,
        y: -1.75
      },
      to: {
        x: 11.25,
        y: -2.25
      }
    },
    // Dynamo DB 1 Block Highlight
    {
      id: 'dynamodb-1-block-highlight',
      color: customVars.diagramPalette.grey,
      from: {
        x: 4.75,
        y: -14.75
      },
      to: {
        x: 5.25,
        y: -15.25
      }
    },
    // Dynamo DB 2 Block Highlight
    {
      id: 'dynamodb-2-block-highlight',
      color: customVars.diagramPalette.grey,
      from: {
        x: 2.75,
        y: -10.75
      },
      to: {
        x: 3.25,
        y: -11.25
      }
    },
    // Dynamo DB 3 Block Highlight
    {
      id: 'dynamodb-3-block-highlight',
      color: customVars.diagramPalette.grey,
      from: {
        x: 7.75,
        y: -10.75
      },
      to: {
        x: 8.25,
        y: -11.25
      }
    },
    // AWS S3 Bucket Highlight
    {
      id: 's3-bucket-block-highlight',
      color: customVars.diagramPalette.grey,
      from: {
        x: -4.75,
        y: -10.75
      },
      to: {
        x: -5.25,
        y: -11.25
      }
    },
    // AWS Lambda 1 Block Highlight
    {
      id: 'lambda-1-block-highlight',
      color: customVars.diagramPalette.grey,
      from: {
        x: -10.75,
        y: -0.25
      },
      to: {
        x: -11.25,
        y: 0.25
      }
    },
    // AWS Lambda 2 Block Highlight
    {
      id: 'lambda-2-block-highlight',
      color: customVars.diagramPalette.grey,
      from: {
        x: -12.75,
        y: -2.75
      },
      to: {
        x: -13.25,
        y: -3.25
      }
    },
    // AWS Lambda 2 Block Highlight
    {
      id: 'lambda-3-block-highlight',
      color: customVars.diagramPalette.grey,
      from: {
        x: -10.75,
        y: -5.75
      },
      to: {
        x: -11.25,
        y: -6.25
      }
    },
    // Websockets Block Highlight
    {
      id: 'websocket-block-highlight',
      color: customVars.diagramPalette.grey,
      from: {
        x: -10.75,
        y: 4.75
      },
      to: {
        x: -11.25,
        y: 5.25
      }
    },
    // Endpoint Client 1 Block Highlight
    {
      id: 'endpoint-client-1-block-highlight',
      color: customVars.diagramPalette.grey,
      from: {
        x: -0.25,
        y: 10.75
      },
      to: {
        x: 0.25,
        y: 11.25
      }
    },
    // Endpoint Client 2 Block Highlight
    {
      id: 'endpoint-client-2-block-highlight',
      color: customVars.diagramPalette.grey,
      from: {
        x: 2.75,
        y: 10.75
      },
      to: {
        x: 3.25,
        y: 11.25
      }
    },
    // Endpoint Client 3 Block Highlight
    {
      id: 'endpoint-client-3-block-highlight',
      color: customVars.diagramPalette.grey,
      from: {
        x: -2.75,
        y: 10.75
      },
      to: {
        x: -3.25,
        y: 11.25
      }
    }
  ]
};
