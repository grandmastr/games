import {ReactElement} from "react";

export default function ({children}: {children: React.ReactNode}): ReactElement {
  return (
    <button
      className={
        'transition ease-in-out px-3 py-1.5 bg-white text-black rounded-sm hover:scale-150'
      }>
      {children}
    </button>
  );
};
