import { Box } from '@mui/material';
import { styled } from '@mui/system';
import React from 'react';
import { BIRD_HEIGHT, BIRD_WIDTH, DEFAULT_BIRD_X } from '../../const';
interface IBirdy {
  y: number;
}
const Birdy = styled(Box)<IBirdy>(({ y }) => ({
  position: 'absolute',
  bottom: y,
  left: DEFAULT_BIRD_X,
  width: BIRD_WIDTH,
  height: BIRD_HEIGHT,
  backgroundColor: 'white',
}));

export const Bird: React.FC<{ birdY: number }> = ({ birdY }) => {
  return <Birdy y={birdY} />;
};
