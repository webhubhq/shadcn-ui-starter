import React, { useMemo } from 'react';
import { Box } from '@mui/material';

interface Props {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  height?: number;
}

const tools = ['bold', 'italic', 'underline', 'strike', 'link'];

export const MarkdownEditor = ({
  value,
  onChange,
  readOnly,
  height = 120
}: Props) => {
  const modules = useMemo(() => {
    if (!readOnly)
      return {
        toolbar: tools
      };

    return { toolbar: false };
  }, [readOnly]);

  return (
    <Box
      sx={{
        '.ql-toolbar.ql-snow': {
          border: 'none',
          pt: 0,
          px: 0
        },
        '.ql-toolbar.ql-snow + .ql-container.ql-snow': {
          border: '1px solid',
          borderColor: 'grey.800',
          borderTop: 'auto',
          borderRadius: 1.5,
          height
        },
        '.ql-container.ql-snow': {
          ...(readOnly ? { border: 'none' } : {})
        },
        '.ql-editor': {
          ...(readOnly ? { p: 0 } : {}),
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'center'
        }
      }}
    >
      <span>{value}</span>
    </Box>
  );
};
