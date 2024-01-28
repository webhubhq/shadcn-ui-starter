import React from 'react';
import { Slider, Box } from '@mui/material';
import { Node } from '@/src-isoflow/types';
import { MarkdownEditor } from '@/src-isoflow/components/MarkdownEditor/MarkdownEditor';
import { DeleteButton } from '../../components/DeleteButton';
import { Section } from '../../components/Section';

interface Props {
  label: string;
  labelHeight: number;
  onUpdate: (updates: Partial<Node>) => void;
  onDelete: () => void;
}

export const NodeSettings = ({
  label,
  labelHeight,
  onUpdate,
  onDelete
}: Props) => {
  return (
    <div style={{ minHeight: 'calc(' }}>
      <Section title="Label">
        <div>my info</div>
        <Box>
          <DeleteButton
            onClick={() => {
              return console.log('deploy');
            }}
          />
        </Box>
      </Section>
      {label && (
        <Section title="Label height">
          <Slider
            marks
            step={20}
            min={60}
            max={280}
            value={labelHeight}
            onChange={(e, newHeight) => {
              onUpdate({ labelHeight: newHeight as number });
            }}
          />
        </Section>
      )}
      <Section>
        <Box>
          <DeleteButton onClick={onDelete} />
        </Box>
      </Section>
    </div>
  );
};
