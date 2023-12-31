'use client';

import React, {ReactElement} from 'react';

import {Button} from './components';

const Pong = (): ReactElement => {
  const canvas = React.useRef<HTMLCanvasElement | null>(null);
  const animationId = React.useRef<number | null>(null);

  const [isRunning, setIsRunning] = React.useState<boolean>(false);

  React.useEffect(() => {
    let ctx: CanvasRenderingContext2D;

    if (canvas.current) {
      // @ts-ignore
      ctx = canvas.current.getContext('2d');
    }
  }, []);

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
        <Button>Start</Button>
        <Button>Pause</Button>
        <Button>Restart</Button>
      </div>
      <p className={'text-center m-5'}>
        Controls: Player 1 (W and S) | Player 2 (Arrow Up and Down){' '}
      </p>
    </div>
  );
};

export default Pong;
