import { Box } from '@mui/material';
import React from 'react';
import { Button, styled } from '@mui/material';
import { GAME_WIDTH } from '../../const';

interface Props {
  gameStarted: boolean;
  gameInProgress: boolean;
  volume: number;
  onStart: () => void;
  onRestart: () => void;
  toggleVolume: () => void;
}

const Wrapper = styled(Box)(() => ({
  width: GAME_WIDTH,
  textAlign: 'right',
  display: 'flex',
  justifyContent: 'space-between',
  margin: 'auto',
}));

const RestartButton = styled(Button)(({ theme }) => ({
  display: 'block',
  width: '100%',
  marginTop: theme.spacing(2),
}));

const StartButton = styled(Button)(({ theme }) => ({
  display: 'block',
  width: '100%',
  marginTop: theme.spacing(2),
}));

const SoundButton = styled(Button)(({ theme }) => ({
  color: theme.palette.secondary.light,
  marginTop: theme.spacing(2),
  marginRight: theme.spacing(1),
}));

export const Controls: React.FC<Props> = ({
  onRestart,
  onStart,
  gameStarted,
  gameInProgress,
  toggleVolume,
  volume,
}) => {
  if (gameInProgress) {
    return null;
  }
  return (
    <Wrapper>
      <SoundButton variant='text' onClick={toggleVolume}>
        {volume === 1 ? 'Mute' : 'Unmute'}
      </SoundButton>
      {!gameStarted && (
        <StartButton variant='contained' onClick={onStart}>
          Start game
        </StartButton>
      )}
      {gameStarted && (
        <RestartButton variant='contained' onClick={onRestart}>
          Restart
        </RestartButton>
      )}
    </Wrapper>
  );
};
