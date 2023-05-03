import { Box } from '@mui/material';
import { styled } from '@mui/system';
import { ReactNode } from 'react';
import { GAME_HEIGHT, GAME_WIDTH } from '../../const';

interface Props {
  children: ReactNode;
}
const Wrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: GAME_HEIGHT,
  width: GAME_WIDTH,
  background: theme.palette.primary.light,
  userSelect: 'none',
  overflow: 'hidden',
  margin: 'auto',
  borderRadius: 4,
}));
export const GameContainer = ({ children }: Props) => {
  return <Wrapper>{children}</Wrapper>;
};
