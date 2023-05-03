import { Box } from '@mui/material';
import React from 'react';
import { styled } from '@mui/system';
import { GAME_WIDTH } from '../../const';

type Props = {
  score: number;
  gameStarted: boolean;
  highScore: number;
};

const ScoreWrapper = styled(Box)(({ theme }) => ({
  width: GAME_WIDTH,
  display: 'flex',
  justifyContent: 'space-between',
  margin: `0 auto ${theme.spacing(2)}`,
}));

export const Score: React.FC<Props> = ({ score, gameStarted, highScore }) => {
  const hasNewHighScore = highScore > 0 && score >= highScore;

  if (gameStarted) {
    return (
      <ScoreWrapper>
        {hasNewHighScore && <Box>New High Score</Box>}
        <Box sx={{ marginLeft: 'auto' }}>{score}</Box>
      </ScoreWrapper>
    );
  }

  return (
    <ScoreWrapper>
      <Box>High Score</Box>
      <Box sx={{ marginLeft: 'auto' }}>{highScore}</Box>
    </ScoreWrapper>
  );
};
