import { ReactNode, FC } from 'react';
import { Handle, HandleProps, type NodeProps } from '@xyflow/react';
import { StatusCircleIcon } from '@/components/common/statusIcon';

import { WorkflowNodeBackground, WORKFLOW_CLOUD } from '@/utils/workflows';
import { classNames } from '@/utils/commonUtils';

interface WorkflowNodeProps extends NodeProps {
  data: {
    type: string;
    title: ReactNode;
    backgroundColor?: WorkflowNodeBackground;
    handlers?: HandleProps[];
    detail: {
      status: string;
      description?: string;
    };
  };
}

// func tp pick up teh color from tehe data.type

const WorkflowNode: FC<WorkflowNodeProps> = ({ data }) => {
  const backgroundColor = WorkflowNodeBackground[WORKFLOW_CLOUD[data.type]];

  // console.log('WorkflowNode:', data, positionAbsoluteX, positionAbsoluteY, backgroundColor);

  return (
    <div className='rounded-md border-2 border-stone-400 bg-white shadow-md'>
      <div className='flex h-full w-full flex-col'>
        <div className={classNames('px-4 py-2 text-lg font-bold', backgroundColor)}>
          {data.title}
        </div>
        <div className='flex items-center p-2 px-4 py-1'>
          <StatusCircleIcon status={data.detail.status} className='text-lg' />
          <div className='max-w-[200px] pl-2 pr-4'>
            <div className='text-lg'>{data.detail?.status}</div>
            <span className='text-gray-500'>{data.detail?.description}</span>
          </div>
        </div>
      </div>

      {data.handlers?.map((handler, index) => {
        return <Handle key={index} {...handler} />;
      })}
    </div>
  );
};

export default WorkflowNode;
