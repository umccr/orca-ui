/* eslint-disable react-refresh/only-export-components */
// https://github.com/ArnaudBarre/eslint-plugin-react-refresh/issues/25#issuecomment-1729071347

import { FC } from 'react';
import { Bounce, toast, ToastOptions } from 'react-toastify';

export enum ToastType {
  success = 'success',
  error = 'error',
  info = 'info',
  warning = 'warning',
  default = 'default',
}
export type Id = string | number;
export interface MsgProps {
  title: string;
  message?: string;
  type?: ToastType;
}
export const Msg: FC<MsgProps> = ({ title, message, type }) => {
  const typeClass = (type: ToastType) => {
    switch (type) {
      case ToastType.success:
        return 'text-green-600 dark:text-green-400';
      case ToastType.error:
        return 'text-red-600 dark:text-red-400';
      case ToastType.info:
        return 'text-blue-600 dark:text-blue-400';
      case ToastType.warning:
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className={`flex items-start ${typeClass(type || ToastType.default)}`}>
      <div className='w-full'>
        <h3 className='text-sm font-medium text-current'>{title}</h3>
        {message && <p className='mt-1 text-sm opacity-90'>{message}</p>}
      </div>
    </div>
  );
};

const defaultToastProps: ToastOptions = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'light',
  transition: Bounce,
  className: 'dark:bg-gray-800',
};

const createToast =
  (type: ToastType) =>
  (myProps: MsgProps, toastProps?: ToastOptions): Id => {
    const options = {
      ...defaultToastProps,
      ...toastProps,
      render: <Msg {...myProps} />,
    };
    const content = <Msg {...myProps} type={type} />;

    return type === ToastType.default ? toast(content, options) : toast[type](content, options);
  };

const toaster = {
  default: createToast(ToastType.default),
  success: createToast(ToastType.success),
  error: createToast(ToastType.error),
  info: createToast(ToastType.info),
  warning: createToast(ToastType.warning),
};

export default toaster;
