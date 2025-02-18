import { FC } from 'react';
import { FetchUserAttributesOutput } from '@aws-amplify/auth';
import { Dialog } from '@/components/common/dialogs';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import UserProfileSection from './UserProfileSection';
import { Badge } from '@/components/common/badges';
import { Textarea } from '@headlessui/react';

interface StatesDialogProps {
  isOpenAddStateDialog: boolean;
  isOpenUpdateStateDialog: boolean;
  user: FetchUserAttributesOutput;
  validState: string[];
  stateStatus: string | null;
  setStateStatus: (status: string | null) => void;
  selectedState: string | null;
  currentState: string | null;
  handleClose: () => void;
  stateComment: string;
  setStateComment: (comment: string) => void;
  handleStateCreationEvent: () => void;
  handleUpdateState: () => void;
}

const StatesDialog: FC<StatesDialogProps> = ({
  isOpenAddStateDialog,
  isOpenUpdateStateDialog,
  user,
  validState,
  stateStatus,
  setStateStatus,
  selectedState,
  currentState,
  handleClose,
  stateComment,
  setStateComment,
  handleStateCreationEvent,
  handleUpdateState,
}) => {
  return (
    <Dialog
      TitleIcon={PlusCircleIcon}
      open={isOpenAddStateDialog || isOpenUpdateStateDialog}
      title={isOpenAddStateDialog ? 'Add New State' : 'Update State'}
      content={
        <div className='flex flex-col gap-4 p-2'>
          {/* User Info Section */}
          <UserProfileSection user={user} />

          {/* state status */}
          {isOpenAddStateDialog && (
            <div className='flex flex-col gap-2'>
              <div className='mb-1 pt-1 text-xs font-medium'>Please select the state status:</div>
              <div className='flex flex-wrap gap-1'>
                {validState?.map((state, idx) => (
                  <label
                    key={idx}
                    className='flex cursor-pointer items-center rounded-md border px-2 py-1 transition-colors'
                  >
                    <input
                      type='radio'
                      name='state'
                      value={state}
                      onChange={() => setStateStatus(state)}
                    />
                    <span className='ml-1 text-xs font-medium'>{state}</span>
                  </label>
                ))}
              </div>
              {!stateStatus && <div className='text-xs text-red-500'>Please select a state</div>}
            </div>
          )}

          {isOpenUpdateStateDialog && (
            <div className='flex flex-col gap-2'>
              <label className='text-sm font-medium text-gray-700'>Current State Status</label>
              <div className='rounded-lg bg-gray-50 p-3 dark:bg-gray-700'>
                <Badge status={selectedState || currentState || 'unknown'}>
                  {selectedState || currentState || 'unknown'}
                </Badge>
              </div>
            </div>
          )}

          {/* State Comment Input Section */}
          <div className='flex flex-col gap-2'>
            <label
              htmlFor='stateComment'
              className='text-sm font-medium text-gray-700 dark:text-gray-300'
            >
              Comment
            </label>
            <Textarea
              id='stateComment'
              value={stateComment}
              onChange={(e) => setStateComment(e.target.value)}
              placeholder='Write your state comment here...'
              className='min-h-[120px] w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100'
            />
          </div>
        </div>
      }
      onClose={() => {
        handleClose();
        setStateComment('');
        setStateStatus(null);
      }}
      closeBtn={{
        label: 'Close',
        onClick: () => {
          handleClose();
          setStateComment('');
          setStateStatus(null);
        },
      }}
      confirmBtn={{
        label: isOpenAddStateDialog ? 'Add State' : 'Update State',
        onClick: isOpenAddStateDialog ? handleStateCreationEvent : handleUpdateState,
      }}
    ></Dialog>
  );
};

export default StatesDialog;
