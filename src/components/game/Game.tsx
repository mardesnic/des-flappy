import React, { useEffect, useRef, useState } from 'react';
import { Wrapper } from '../layout/Wrapper';
import { Bird } from './Bird';
import { GameContainer } from './GameContainer';
import { Box } from '@mui/material';
import { Obstacle } from './Obstacle';
import { Controls } from './Controls';
import { Score } from './Score';
import { useWindowSize } from 'react-use';
import { styled } from '@mui/system';
import {
  BIRD_HEIGHT,
  BIRD_WIDTH,
  DEFAULT_BIRD_X,
  DEFAULT_BIRD_Y,
  DEFAULT_OBSTACLE_X,
  DEFAULT_OBSTALCE_HEIGHT,
  GAME_HEIGHT,
  GRAVITY,
  JUMP_HEIGHT,
  LOCAL_STORAGE_HIGHSCORE_KEY,
  LOCAL_STORAGE_VOLUME_KEY,
  OBSTACLE_SPEED,
  OBSTACLE_WIDTH,
  OBSTALCE_GAP_HEIGHT,
  SOUND_DEATH,
  SOUND_MUSIC,
} from '../../const';
import Confetti from 'react-confetti';
import {
  loadAudio,
  loadFromLocalStorage,
  saveToLocalStorage,
} from '../../utils/functions';
import { Loading } from './Loading';

const JumpWrapper = styled(Box)(() => ({
  userSelect: 'none',
}));

export const Game: React.FC = () => {
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const music = useRef<HTMLAudioElement | null>(null);
  const deathSound = useRef<HTMLAudioElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const lastUpdateTime = useRef<number | null>(null);
  const delta = useRef<number>(0);
  const [loading, setLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameInProgress, setGameInProgress] = useState(false);
  const [birdY, setBirdY] = useState(DEFAULT_BIRD_Y);
  const [obstacleX, setObstacleX] = useState(DEFAULT_OBSTACLE_X);
  const [obstacleHeight, setObstacleHeight] = useState(DEFAULT_OBSTALCE_HEIGHT);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    loadFromLocalStorage(LOCAL_STORAGE_HIGHSCORE_KEY, 0)
  );
  const [volume, setVolume] = useState(
    loadFromLocalStorage(LOCAL_STORAGE_VOLUME_KEY, 1)
  );

  const bottomObstacleHeight =
    GAME_HEIGHT - OBSTALCE_GAP_HEIGHT - obstacleHeight;

  const startGame = () => {
    setGameStarted(true);
    if (music.current) {
      music.current.currentTime = 0;
      music.current.play();
    }
    setGameInProgress(true);
    setBirdY(DEFAULT_BIRD_Y);
    lastUpdateTime.current = performance.now();
  };

  const endGame = () => {
    if (deathSound.current) {
      deathSound.current.currentTime = 0;
      deathSound.current.play();
    }
    if (music.current) {
      music.current.pause();
    }
    setGameInProgress(false);
    if (score > highScore) {
      setHighScore(score);
      saveToLocalStorage(LOCAL_STORAGE_HIGHSCORE_KEY, score);
    }
  };

  const restartGame = () => {
    setObstacleX(DEFAULT_OBSTACLE_X);
    setObstacleHeight(DEFAULT_OBSTALCE_HEIGHT);
    setScore(0);
    startGame();
  };

  const jump = () => {
    if (!gameInProgress) {
      return;
    }
    setBirdY((prev) => {
      const newY = prev + JUMP_HEIGHT;
      if (newY <= GAME_HEIGHT - BIRD_HEIGHT) {
        return newY;
      }
      return GAME_HEIGHT - BIRD_HEIGHT;
    });
  };

  const toggleVolume = () => {
    const newVolume = volume === 1 ? 0 : 1;
    setVolume(newVolume);
    saveToLocalStorage(LOCAL_STORAGE_VOLUME_KEY, newVolume);

    if (music.current) {
      music.current.volume = newVolume;
    }
    if (deathSound.current) {
      deathSound.current.volume = newVolume;
    }
  };

  useEffect(() => {
    const detectCollision = () => {
      const horizontalRange =
        obstacleX <= DEFAULT_BIRD_X + BIRD_WIDTH &&
        obstacleX + OBSTACLE_WIDTH >= DEFAULT_BIRD_X;

      if (horizontalRange) {
        const topObstacleVerticalAlign =
          birdY + BIRD_HEIGHT > GAME_HEIGHT - obstacleHeight;
        const bottomObstacleVerticalAlign = birdY <= bottomObstacleHeight;

        if (topObstacleVerticalAlign || bottomObstacleVerticalAlign) {
          endGame();
        }
      }
    };

    if (
      obstacleX <= DEFAULT_BIRD_X + BIRD_WIDTH &&
      obstacleX + OBSTACLE_WIDTH >= DEFAULT_BIRD_X
    ) {
      detectCollision();
    }
  }, [obstacleX, obstacleHeight, birdY, bottomObstacleHeight]);

  useEffect(() => {
    const gameLoop = () => {
      if (!gameInProgress) {
        return;
      }
      const now = performance.now();
      delta.current += now - (lastUpdateTime.current || now);
      lastUpdateTime.current = now;
      if (delta.current > 1000 / 40) {
        delta.current = 0;
        setBirdY((prev) => {
          const newY = prev - GRAVITY;
          if (newY > 0) {
            return newY;
          }
          endGame();
          return 0;
        });
        setObstacleX((prev) => {
          const newX = prev - OBSTACLE_SPEED;
          if (newX >= 0 - 1.2 * OBSTACLE_WIDTH) {
            return newX;
          }
          return DEFAULT_OBSTACLE_X;
        });
      }

      animationFrameId.current = requestAnimationFrame(gameLoop);
    };

    if (gameInProgress) {
      animationFrameId.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [gameInProgress]);

  useEffect(() => {
    if (obstacleX > 0 - OBSTACLE_WIDTH) {
      return;
    }
    const newObstacleHeight = Math.floor(
      Math.random() * (GAME_HEIGHT - OBSTALCE_GAP_HEIGHT)
    );
    setScore((prev) => prev + 5);
    setObstacleHeight(newObstacleHeight);
  }, [obstacleX]);

  useEffect(() => {
    Promise.all([
      loadAudio(SOUND_MUSIC).then((audio) => {
        music.current = audio;
        if (music.current) {
          music.current.volume = volume;
        }
      }),
      loadAudio(SOUND_DEATH).then((audio) => {
        deathSound.current = audio;
        if (deathSound.current) {
          deathSound.current.volume = volume;
        }
      }),
    ])
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading assets:', error);
      });
    return () => {
      endGame();
    };
  }, [volume]);

  const hasNewHighScore = highScore > 0 && score >= highScore;

  if (loading) {
    return <Loading />;
  }

  return (
    <JumpWrapper onClick={jump}>
      {hasNewHighScore && (
        <Confetti width={windowWidth} height={windowHeight} gravity={0.05} />
      )}
      <Wrapper>
        <Box>
          <Score
            score={score}
            highScore={highScore}
            gameStarted={gameStarted}
          />
          <GameContainer>
            <Obstacle y={0} x={obstacleX} height={obstacleHeight} />
            <Obstacle
              y={GAME_HEIGHT - (obstacleHeight + bottomObstacleHeight)}
              x={obstacleX}
              height={bottomObstacleHeight}
            />
            <Bird birdY={birdY} />
          </GameContainer>
          <Controls
            onRestart={restartGame}
            onStart={startGame}
            gameStarted={gameStarted}
            gameInProgress={gameInProgress}
            toggleVolume={toggleVolume}
            volume={volume}
          />
        </Box>
      </Wrapper>
    </JumpWrapper>
  );
};
