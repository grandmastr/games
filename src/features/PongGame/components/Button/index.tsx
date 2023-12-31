import {ReactElement} from 'react';

/**
 * Renders a button component.
 *
 * @param {React.ReactNode} children - The content to be displayed inside the button.
 * @return {React.ReactElement} The rendered button component.
 */
const Button = ({children}: {children: React.ReactNode}): ReactElement => {
  return (
    <button
      className={
        'transition ease-in-out px-3 py-1.5 bg-white text-black rounded-sm hover:scale-150'
      }>
      {children}
    </button>
  );
};

export default Button;
