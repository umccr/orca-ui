import React, { useState } from 'react';
import { Drawer } from '@/components/common/drawers';
import { FileViewer } from '@/components/files';
import { DetailedErrorBoundary } from '@/components/common/error';
import { getFilenameFromKey } from '@/utils/commonUtils';
import Button from '@/components/common/buttons/Button';
import { EyeIcon } from '@heroicons/react/24/outline';

export const FilePreviewDrawer = ({ s3Key, bucket }: { s3Key: string; bucket: string }) => {
  const [isFilePreview, setIsFilePreview] = useState(false);
  return (
    <>
      <Button
        className='!p-2 !m-0 shadow-none'
        onClick={() => {
          setIsFilePreview(true);
        }}
        rounded
        size='md'
        type='gray'
      >
        <EyeIcon className='size-4' />
      </Button>
      <Drawer
        title={getFilenameFromKey(s3Key)}
        isOpen={isFilePreview}
        setIsOpen={() => setIsFilePreview(false)}
        dialogPanelClassName='max-w-5xl'
        content={
          <DetailedErrorBoundary errorTitle='Unable to view file'>
            <FileViewer bucket={bucket} s3Key={s3Key} />
          </DetailedErrorBoundary>
        }
      />
    </>
  );
};
