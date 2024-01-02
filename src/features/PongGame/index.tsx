'use client';
import React, {ReactElement} from 'react';
import {useImmer} from 'use-immer';

import {Button} from './components';

const ballRadius: number = 10;

const paddleHeight: number = 80;
const paddleWidth: number = 10;
const paddleSpeed: number = 10;
const maxScore: number = 10;

const keys: string[] = ['w', 's', 'ArrowUp', 'ArrowDown'];

type Positions = {
  ballX: number;
  ballY: number;
  leftPaddleY: number;
  rightPaddleY: number;
}

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
  const [position, setPosition] = useImmer<Positions>({
    ballX: canvas.current ? canvas.current.width * 0.5 : 0,
    ballY: canvas.current ? canvas.current.height * 0.5 : 0,
    leftPaddleY: canvas.current ? canvas.current.height * 0.5  : 0,
    rightPaddleY: canvas.current ? canvas.current.height * 0.5 : 0
  });

  const [score, setScore] = useImmer<Score>({
    leftPlayer: 0,
    rightPlayer: 0,
  });

  const [ballSpeed, setBallSpeed] = useImmer<BallSpeed>({
    x: 5,
    y: 5
  })

  const [keyDown, setKeyDown] = useImmer<KeyDown>({
    ArrowUp: false,
    ArrowDown: false,
    w: false,
    s: false,
  });

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    }
  }, []);

  React.useEffect(() => {
    // effect to update the position of the ball
    // and repaint the canvas
    if (isRunning) {
      animationId.current = requestAnimationFrame(play);
    }
  }, [position])

  React.useEffect(() => {
    updateGame();
  }, [keyDown])

  // React.useEffect(() => {
  //   if (!isRunning) {
  //     setPosition(draft => {
  //       draft.ballX = (canvas.current as HTMLCanvasElement).width / 2
  //       draft.ballY = (canvas.current as HTMLCanvasElement).height / 2
  //     })
  //     paintInCanvas()
  //   }
  // }, [isRunning, position])

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

    reset();
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
    if (keyDown.ArrowUp && position.rightPaddleY > 0) {
      setPosition(draft => {
        if (draft) {
          draft.rightPaddleY -= paddleSpeed;
        }
      })
    } else if (keyDown.ArrowDown && position.rightPaddleY + paddleHeight < (canvas.current as HTMLCanvasElement).height) {
      setPosition(draft => {
        if (draft) {
          draft.rightPaddleY += paddleSpeed;
        }
      })
    }

    if (keyDown.w && position.leftPaddleY > 0) {
      setPosition(draft => {
        if (draft) {
          draft.leftPaddleY -= paddleSpeed;
        }
      })
    } else if (keyDown.s && position.leftPaddleY + paddleHeight < (canvas.current as HTMLCanvasElement).height) {
      setPosition(draft => {
        if (draft) {
          draft.leftPaddleY += paddleSpeed;
        }
      })
    }

    // actually move the ball
    setPosition(draft => {
      if (draft) {
        draft.ballX += ballSpeed.x;
        draft.ballY += ballSpeed.y;
      }
    });

    // checking if ball collides with top or bottom of canvas
    if (position.ballY - ballRadius < 0) {
      setBallSpeed(draft => {
        draft.y = -draft.y;
      });
    }

    // checking for collision with left paddle
    if (position.ballX - ballRadius < paddleWidth && position.ballY > position.leftPaddleY && position.ballY < position.leftPaddleY + paddleHeight) {
      setBallSpeed(draft => {
        draft.x = -draft.x;
      });
    }

    // checking for collision with right paddle
    if (position.ballX + ballRadius > (canvas.current as HTMLCanvasElement).width - paddleWidth && position.ballY > position.rightPaddleY && position.ballY < position.rightPaddleY + paddleHeight) {
      setBallSpeed(draft => {
        draft.x = -draft.x;
      });
    }

    if (position.ballX < 0) {
      setScore(draft => {
        draft.rightPlayer++;
      })

      reset();
    } else if (position.ballX > (canvas.current as HTMLCanvasElement).width) {
      setScore(draft => {
        draft.leftPlayer++;
      })

      reset();
    }

    if (score.leftPlayer === maxScore) {
      window.alert('Player 1 wins!');
    } else if (score.rightPlayer === maxScore) {
      window.alert('Player 2 wins!');
    }

    paintInCanvas();
  }

  // const paintInCanvas = (): void => {
  //   let ctx: CanvasRenderingContext2D;
  //
  //   canvas.current = canvas.current as HTMLCanvasElement
  //
  //   // @ts-ignore
  //   ctx = canvas.current.getContext('2d');
  //
  //   ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
  //
  //   ctx.fillStyle = '#FFF';
  //   ctx.font = "16px Arial";
  //   ctx.strokeStyle = '#FFF';
  //
  //   ctx.beginPath();
  //   ctx.moveTo(canvas.current.width / 2, 0);
  //   ctx.lineTo(canvas.current.width / 2, canvas.current.height);
  //   ctx.stroke();
  //   ctx.closePath();
  //
  //   // draw ball
  //   ctx.beginPath();
  //   ctx.arc(position.ballX, position.ballY, ballRadius, 0, Math.PI * 2);
  //   ctx.fill();
  //   ctx.closePath();
  //
  //   // left paddle
  //   ctx.fillRect(0, position.leftPaddleY, paddleWidth, paddleHeight);
  //
  //   // right paddle
  //   ctx.fillRect(canvas.current.width - paddleWidth, position.rightPaddleY, paddleWidth, paddleHeight);
  //
  //   ctx.fillText(`Score: ${score.leftPlayer} - ${score.rightPlayer}`, 20, 20);
  // }

  // paintincanvas function to paint paddles and ball, with the ball positioned in the middle of the canvas
  const paintInCanvas = (): void => {
    let ctx: CanvasRenderingContext2D;

    canvas.current = canvas.current as HTMLCanvasElement

    // @ts-ignore
    ctx = canvas.current.getContext('2d');

    ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);

    ctx.fillStyle = '#FFF';
    ctx.font = "16px Arial";
    ctx.strokeStyle = '#FFF';

    ctx.beginPath();
    ctx.moveTo(canvas.current.width / 2, 0);
    ctx.lineTo(canvas.current.width / 2, canvas.current.height);
    ctx.stroke();
    ctx.closePath();

    // draw ball
    ctx.beginPath();
    ctx.arc(position.ballX, position.ballY, ballRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    // left paddle
    ctx.fillRect(0, position.leftPaddleY, paddleWidth, paddleHeight);

    // right paddle
    ctx.fillRect(canvas.current.width - paddleWidth, position.rightPaddleY, paddleWidth, paddleHeight);

    ctx.fillText(`Score: ${score.leftPlayer} - ${score.rightPlayer}`, 20, 20);
  }

  const play = (): void => {
    updateGame();
    paintInCanvas();
    animationId.current = requestAnimationFrame(play);
  }

  const handleKeyDown = (event: KeyboardEvent): void => {
    if (keys.includes(event.key)) {
      event.preventDefault();

      setKeyDown((draft) => {
        draft[event.key as keyof KeyDown] = true;
      })
    }
  }

  const handleKeyUp = (event: KeyboardEvent): void => {
    if (keys.includes(event.key)) {
      event.preventDefault();

      setKeyDown((draft) => {
        draft[event.key as keyof KeyDown] = false;
      })
    }
  }

  return (
    <div className={'max-w-2xl m-auto px-2 flex flex-col'}>
      <canvas
        width={600}
        height={400}
        className={
          'bg-black m-auto border-2 border-solid border-white rounded-lg'
        }
        ref={canvas}
      />
      <div className={'mx-auto mt-5 flex gap-2.5'}>
        <Button onClick={startGame}>Start</Button>
        <Button onClick={pauseGame}>Pause</Button>
        <Button onClick={restartGame}>Restart</Button>
      </div>
      <p className={'text-center m-5'}>
        Controls: Player 1 (W and S) | Player 2 (Arrow Up and Down){' '}
        {JSON.stringify(keyDown)}
        {JSON.stringify(position)}
        {JSON.stringify(ballSpeed)}
        {JSON.stringify(isRunning)}
      </p>
    </div>
  );
};

export default Pong;
