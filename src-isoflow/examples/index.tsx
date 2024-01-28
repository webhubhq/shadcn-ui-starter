"use client"

import React, { useState, useMemo } from 'react';
import { Box, Select, MenuItem, useTheme } from '@mui/material';
import { BasicEditor } from './BasicEditor/BasicEditor';
import { Callbacks } from './Callbacks/Callbacks';
import { DebugTools } from './DebugTools/DebugTools';

const examples = [
  { name: 'Basic editor', component: BasicEditor },
  { name: 'Debug tools', component: DebugTools },
  { name: 'Callbacks', component: Callbacks }
];

export const Examples = () => {
  const theme = useTheme();
  const [currentExample, setCurrentExample] = useState(0);

  const Example = useMemo(() => {
    return examples[currentExample].component;
  }, [currentExample]);

  return (
    <Box sx={{ width: '100vw', height: '100vh' }}>
      <Box sx={{ width: '100%', height: '100%' }}>{Example && <Example />}</Box>
    </Box>
  );
};
