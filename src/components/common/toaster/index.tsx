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
        return 'text-green-500';
      case ToastType.error:
        return 'text-red-500';
      case ToastType.info:
        return 'text-blue-500';
      case ToastType.warning:
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };
  return (
    <div className={`flex items-start ${typeClass(type || ToastType.default)}`}>
      <div className='ml-2 w-0 flex-1 '>
        <p className='text-base font-medium '>{title}</p>
        <p className='mt-1 text-sm '>{message}</p>
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
