import React from 'react';
import { Container } from '../layout/Container';
import { Skeleton, Box } from '@mui/material';
import { styled } from '@mui/system';
import { GAME_HEIGHT, GAME_WIDTH } from '../../const';

const LoadingSkeleton = styled(Skeleton)(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(3),
}));

const LoadingWrapper = styled(Box)(({ theme }) => ({
  width: GAME_WIDTH,
  margin: `${theme.spacing(4)} auto 0`,
}));

export const Loading: React.FC = () => {
  return (
    <Container>
      <LoadingWrapper>
        <LoadingSkeleton variant='rounded' height={GAME_HEIGHT} />
      </LoadingWrapper>
    </Container>
  );
};
