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
  validStatesToCreate?: string[];
  selectedState?: string | null;
  setSelectedState?: (state: string | null) => void;
  currentState?: string | null;
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
  validStatesToCreate,
  selectedState,
  setSelectedState,
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
            <>
              {validStatesToCreate && validStatesToCreate.length > 0 ? (
                <div className='flex flex-col gap-2'>
                  <div className='mb-1 pt-1 text-xs font-medium'>
                    Please select the state status:
                  </div>
                  <div className='flex flex-wrap gap-1'>
                    {validStatesToCreate?.map((state, idx) => (
                      <label
                        key={idx}
                        className='flex cursor-pointer items-center rounded-md border px-2 py-1 transition-colors'
                      >
                        <input
                          type='radio'
                          name='state'
                          value={state}
                          onChange={() => setSelectedState?.(state)}
                        />
                        <span className='ml-1 text-xs font-medium'>{state}</span>
                      </label>
                    ))}
                  </div>
                  {!selectedState && validStatesToCreate && validStatesToCreate.length != 0 && (
                    <div className='text-xs text-red-500'>Please select a state</div>
                  )}
                </div>
              ) : (
                // warning: no validate state
                <div className='flex flex-row gap-1 text-red-500'>
                  <span className='font-medium'>Warning:</span>
                  <span>No validate state found for the current state</span>
                </div>
              )}
            </>
          )}

          {/* current state */}
          {isOpenUpdateStateDialog && (
            <div className='flex flex-col gap-2'>
              <label className='text-sm font-medium text-gray-700'>Current Status</label>
              <div className='rounded-lg bg-gray-50 p-3 dark:bg-gray-700'>
                <Badge status={currentState || 'unknown'}>{currentState || 'unknown'}</Badge>
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
              disabled={
                isOpenAddStateDialog && validStatesToCreate && validStatesToCreate.length == 0
              }
              id='stateComment'
              value={stateComment}
              onChange={(e) => setStateComment(e.target.value)}
              placeholder='Write your state comment here...'
              className='min-h-[120px] w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-900 shadow-xs focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100'
            />
          </div>
        </div>
      }
      onClose={() => {
        handleClose();
        setStateComment('');
        if (setSelectedState) {
          setSelectedState(null);
        }
      }}
      closeBtn={{
        label: 'Close',
        onClick: () => {
          handleClose();
          setStateComment('');
          if (setSelectedState) {
            setSelectedState(null);
          }
        },
      }}
      confirmBtn={{
        label: isOpenAddStateDialog ? 'Add State' : 'Update State',
        onClick: isOpenAddStateDialog ? handleStateCreationEvent : handleUpdateState,
        disabled: validStatesToCreate && validStatesToCreate.length == 0,
      }}
    ></Dialog>
  );
};

export default StatesDialog;
