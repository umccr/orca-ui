import { FC, ReactNode } from 'react';

export interface ButtonProps {
  type: 'primary' | 'secondary' | 'light' | 'green' | 'red' | 'yellow';
  size: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  children: ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

const Button: FC<ButtonProps> = ({
  type,
  size,
  children,
  rounded = false,
  onClick,
  className = '',
}) => {
  const baseStyles =
    'font-normal text-center me-2 mb-2 py-1.5 px-3 text-sm shadow-sm transition-colors duration-300 transform focus:outline-none focus:ring-opacity-80 flex items-center gap-x-2 ';
  const typeStyles: { [key: string]: string } = {
    primary:
      ' text-white bg-blue-700' +
      ' hover:bg-blue-800' +
      ' focus:ring-4 focus:ring-blue-300' +
      ' dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800',
    secondary:
      ' text-blue-700 bg-white' +
      ' border border-blue-700' +
      ' hover:bg-gray-100 hover:text-blue-700' +
      ' focus:z-10 focus:ring-4 focus:ring-blue-300' +
      ' dark:focus:ring-blue-700 dark:bg-gray-800 dark:text-blue-700 dark:border-gray-600 dark:hover:text-blue-700 dark:hover:bg-gray-700',
    light:
      ' text-gray-900 bg-white' +
      ' border border-gray-300' +
      ' hover:bg-gray-100' +
      ' focus:ring-4 focus:ring-gray-100 ' +
      ' dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700',
    green:
      ' text-white bg-green-700' +
      ' hover:bg-green-800' +
      ' focus:ring-4 focus:ring-green-300' +
      ' dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800',
    red:
      ' text-white bg-red-700 ' +
      ' hover:bg-red-800' +
      ' focus:ring-4 focus:ring-red-300' +
      ' dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900',
    yellow:
      ' text-white bg-yellow-400' +
      ' hover:bg-yellow-500' +
      ' focus:ring-4 focus:ring-yellow-300' +
      ' dark:focus:ring-yellow-900',
  };

  const sizeStyles: { [key: string]: string } = {
    sm: ' text-sm px-3 py-1.5 ',
    md: ' text-md px-4 py-2 ',
    lg: ' text-lg px-5 py-2.5 ',
  };

  const roundedStyles = rounded ? ' rounded-full ' : ' rounded-lg ';

  return (
    <button
      type='button'
      className={`${baseStyles} ${typeStyles[type]} ${sizeStyles[size]} ${roundedStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
