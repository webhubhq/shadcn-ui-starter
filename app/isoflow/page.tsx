"use client"

// This is a development entry point for the app.
// It is not used in production or included in the build.
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material';

import { themeConfig } from '../../src/styles/theme';
import { BasicEditor } from '@/src/examples/BasicEditor/BasicEditor';
import { useUiStateStore } from '@/src/stores/uiStateStore';


export default function Page({}) {

  return (
    <>
      <ThemeProvider theme={createTheme({ ...themeConfig, palette: {} })}>
        <BasicEditor />
      </ThemeProvider>
    </>
  )

};
