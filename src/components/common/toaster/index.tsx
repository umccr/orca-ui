import { FC } from 'react';
import { toast, ToastOptions } from 'react-toastify';

export type Id = string | number;
export interface MsgProps {
  title: string;
  message: string;
}
export const Msg: FC<MsgProps> = ({ title, message }) => {
  return (
    <div className='flex items-start'>
      <div className='ml-2 w-0 flex-1 '>
        <p className='text-base font-medium text-white'>{title}</p>
        <p className='mt-1 text-sm text-white'>{message}</p>
      </div>
    </div>
  );
};

const toaster = (myProps: MsgProps, toastProps?: ToastOptions): Id =>
  toast(<Msg {...myProps} />, { ...toastProps });

toaster.success = (myProps: MsgProps, toastProps?: ToastOptions): Id =>
  toast.success(<Msg {...myProps} />, { theme: 'colored', ...toastProps });

toaster.error = (myProps: MsgProps, toastProps?: ToastOptions): Id =>
  toast.error(<Msg {...myProps} />, { theme: 'colored', ...toastProps });

toaster.info = (myProps: MsgProps, toastProps?: ToastOptions): Id =>
  toast.info(<Msg {...myProps} />, { theme: 'colored', ...toastProps });

toaster.warning = (myProps: MsgProps, toastProps?: ToastOptions): Id =>
  toast.warning(<Msg {...myProps} />, { theme: 'colored', ...toastProps });

export default toaster;
