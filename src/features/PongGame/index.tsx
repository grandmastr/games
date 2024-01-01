'use client';
import React, {ReactElement} from 'react';
import {useImmer} from 'use-immer';

import {Button} from './components';

const ballRadius: number = 10;

const paddleHeight: number = 80;
const paddleWidth: number = 10;
const paddleSpeed: number = 10;
const maxScore: number = 0;

const keys: string[] = ['w', 's', 'ArrowUp', 'ArrowDown'];

type Positions = {
  ballX: number;
  ballY: number;
  leftPaddleY: number;
  rightPaddleY: number;
} | undefined

type Score = {
  leftPlayer: number;
  rightPlayer: number;
};

type KeyDown = {
  ArrowUp: boolean;
  ArrowDown: boolean;
  w: boolean;
  s: boolean;
}

type BallSpeed = {
  x: number;
  y: number;
}

const Pong = (): ReactElement => {
  const canvas = React.useRef<HTMLCanvasElement | null>(null);
  const animationId = React.useRef<number | null>(null);

  const [isRunning, setIsRunning] = React.useState<boolean>(false);
  const [position, setPosition] = useImmer<Positions>(() => {
    if (canvas.current) {
      return {
        ballX: canvas.current.width * 0.5,
        ballY: canvas.current.height * 0.5,
        leftPaddleY: canvas.current.height * 0.5 - paddleHeight * 0.5,
        rightPaddleY: canvas.current.height * 0.5 - paddleHeight * 0.5
      }
    }
  });

  const [score, setScore] = useImmer<Score>({
    leftPlayer: 0,
    rightPlayer: 0,
  });

  const [ballSpeed, setBallSpeed] = useImmer<BallSpeed>({
    x: 5,
    y: 5
  })

  const [isKeyDown, setIsKeyDown] = useImmer<KeyDown>({
    ArrowUp: false,
    ArrowDown: false,
    w: false,
    s: false,
  });

  React.useEffect(() => {
    let ctx: CanvasRenderingContext2D;

    if (canvas.current) {
      // @ts-ignore
      ctx = canvas.current.getContext('2d');

      paintInCanvas();
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    }
  }, []);

  const startGame = (): void => {
    if (!isRunning) {
      setIsRunning(true);
      play();
    }
  }

  const pauseGame = (): void => {
    setIsRunning(false);

    if (animationId.current) {
      cancelAnimationFrame(animationId.current);
    }
  }

  const restartGame = (): void => {
    setIsRunning(false);
    // some reset action
  }

  const reset = (): void => {
    setPosition(draft => {
      if (draft && canvas.current) {
        draft.ballX = canvas.current.width / 2;
        draft.ballY = canvas.current.height / 2;
      }
    });
    setBallSpeed(draft => {
      draft.x = -draft.x;
      draft.y = Math.random() * 10 - 5;
    });
  }

  const updateGame = (): void => {
    if (position) {
      if (isKeyDown.ArrowUp && position.rightPaddleY > 0) {
        setPosition(draft => {
          if (draft) {
            draft.rightPaddleY -= paddleSpeed;
          }
        })
      } else if (isKeyDown.ArrowDown && position.rightPaddleY + paddleHeight < (canvas.current as HTMLCanvasElement).height) {
        setPosition(draft => {
          if (draft) {
            draft.rightPaddleY += paddleSpeed;
          }
        })
      }

      if (isKeyDown.w && position.leftPaddleY > 0) {
        setPosition(draft => {
          if (draft) {
            draft.leftPaddleY -= paddleSpeed;
          }
        })
      } else if (isKeyDown.s && position.leftPaddleY + paddleHeight < (canvas.current as HTMLCanvasElement).height) {
        setPosition(draft => {
          if (draft) {
            draft.leftPaddleY += paddleSpeed;
          }
        })
      }

      setPosition(draft => {
        if (draft) {
          draft.ballX += ballSpeed.x;
          draft.ballY += ballSpeed.y;
        }
      })
    }
  }

  const paintInCanvas = (): void => {

  }

  const play = (): void => {
    updateGame();
    paintInCanvas();
    animationId.current = requestAnimationFrame(play);
  }

  const handleKeyDown = (event: KeyboardEvent): void => {
    if (keys.includes(event.key)) {
      event.preventDefault();

      setIsKeyDown((draft) => {
        draft[event.key as keyof KeyDown] = true;
      })
    }
  }

  const handleKeyUp = (event: KeyboardEvent): void => {
    if (keys.includes(event.key)) {
      event.preventDefault();

      setIsKeyDown((draft) => {
        draft[event.key as keyof KeyDown] = false;
      })
    }
  }

  return (
    <div className={'max-w-2xl m-auto px-2 flex flex-col'}>
      <canvas
        width={600}
        height={600}
        className={
          'bg-black m-auto border-2 border-solid border-white rounded-lg'
        }
        ref={canvas}
      />
      <div className={'mx-auto mt-5 flex gap-2.5'}>
        <Button onClick={console.log}>Start</Button>
        <Button onClick={console.log}>Pause</Button>
        <Button onClick={console.log}>Restart</Button>
      </div>
      <p className={'text-center m-5'}>
        Controls: Player 1 (W and S) | Player 2 (Arrow Up and Down){' '}
        {JSON.stringify(isKeyDown)}
      </p>
    </div>
  );
};

export default Pong;
