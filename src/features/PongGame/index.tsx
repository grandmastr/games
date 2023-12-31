import {ReactElement} from 'react';

const Pong = (): ReactElement => {
  return (
    <div className={'max-w-2xl m-auto px-2 flex flex-col'}>
      <canvas
        width={600}
        height={600}
        className={'bg-red-100 m-auto border-1 border-solid border-black'}
      />
      <div className={'mx-auto mt-5 flex gap-2.5'}>
        <button className={'px-3 py-1.5 bg-white text-black rounded-sm'}>
          Start
        </button>
        <button className={'px-3 py-1.5 bg-white text-black rounded-sm'}>
          Pause
        </button>
        <button className={'px-3 py-1.5 bg-white text-black rounded-sm'}>
          Restart
        </button>
      </div>
      <p className={'text-center m-5'}>
        Controls: Player 1 (W amd S) | Player 2 (Arrow Up and Down){' '}
      </p>
    </div>
  );
};

export default Pong;
