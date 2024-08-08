import { ReactNode, FC } from 'react';
import { Handle, HandleProps, type NodeProps } from '@xyflow/react';
import { StatusIcon } from '@/components/common/statusIcon';

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
    <div className='shadow-md rounded-md bg-white border-2 border-stone-400'>
      <div className='flex flex-col h-full w-full'>
        <div className={classNames('text-lg font-bold px-4 py-2 ', backgroundColor)}>
          {data.title}
        </div>
        <div className='flex items-center px-4 py-1 p-2 '>
          <StatusIcon status={data.detail.status} className='text-lg' />
          <div className='pl-2 pr-4 max-w-[200px]'>
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
