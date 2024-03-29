import React from 'react';

const DocumentAnnotationsContext = React.createContext();
const DocumentContext = React.createContext();
const DocumentFiltersContext = React.createContext();
const DocumentActiveAnnotationsContext = React.createContext();
const WebsocketContext = React.createContext();

export {
  DocumentAnnotationsContext,
  DocumentContext,
  DocumentFiltersContext,
  DocumentActiveAnnotationsContext,
  WebsocketContext,
};
