import chroma from 'chroma-js';
import { v4 as uuid } from 'uuid';

export const generateId = () => {
  return uuid();
};

export const clamp = (num: number, min: number, max: number) => {
  return Math.max(Math.min(num, max), min);
};

export const getRandom = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

export const roundToOneDecimalPlace = (num: number) => {
  return Math.round(num * 10) / 10;
};

interface GetColorVariantOpts {
  alpha?: number;
  grade?: number;
}

export const getColorVariant = (
  color: string,
  variant: 'light' | 'dark',
  { alpha = 1, grade = 1 }: GetColorVariantOpts
) => {
  switch (variant) {
    case 'light':
      return chroma(color).brighten(grade).alpha(alpha).css();
    case 'dark':
      return chroma(color).darken(grade).saturate(grade).alpha(alpha).css();
    default:
      return chroma(color).alpha(alpha).css();
  }
};

export const setWindowCursor = (cursor: string) => {
  window.document.body.style.cursor = cursor;
};
