import { Box } from '@mui/material';
import { styled } from '@mui/system';
import React from 'react';
import { OBSTACLE_WIDTH } from '../../const';

interface Props {
  x: number;
  y: number;
  height: number;
}

interface PipeProps {
  x: number;
  y: number;
  height: number;
}

const Pipe = styled(Box)<PipeProps>(({ theme, x, y, height }) => ({
  width: OBSTACLE_WIDTH,
  position: 'relative',
  background: theme.palette.primary.main,
  left: x,
  top: y,
  height: height,
}));

export const Obstacle: React.FC<Props> = ({ x, y, height }) => {
  return <Pipe x={x} y={y} height={height} />;
};
