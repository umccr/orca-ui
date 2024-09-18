import { FC, useState, useEffect } from 'react';
import { classNames } from '@/utils/commonUtils';
import { Tooltip } from '../tooltips';

interface TimelineEvent {
  id: number;
  content: string;
  comment?: string;
  datetime: string;
  iconBackground: string;
  payloadId: number;
}

interface TimelineProps {
  timeline: TimelineEvent[];
  handldEventClick: (id: number) => void;
  selectId: number | null;
}

const Timeline: FC<TimelineProps> = ({ timeline, handldEventClick, selectId }) => {
  const [selectedEventPayloadId, setSelectedEventPayloadId] = useState<number | null>(selectId);
  useEffect(() => {
    if (selectId) {
      setSelectedEventPayloadId(selectId);
    }
  }, [selectId]);

  return (
    <div>
      <ul role='list' className=''>
        {timeline.map((event, eventIdx) => (
          <li key={event.id}>
            <div className='relative pb-8 flex items-center'>
              {eventIdx !== timeline.length - 1 ? (
                <span
                  aria-hidden='true'
                  className='absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200'
                />
              ) : null}
              <Tooltip
                text={
                  <>
                    timestamp: {event.datetime || ''}
                    <br />
                    comment: {event.comment || ''}
                  </>
                }
                position='right'
                size='small'
                background='gray'
              >
                <div className='relative flex space-x-3'>
                  <div>
                    <div
                      className={classNames(
                        event.iconBackground,
                        'flex h-8  items-center justify-center rounded-full',
                        'cursor-pointer',
                        selectedEventPayloadId === event.payloadId ? 'ring-2 ring-indigo-500' : ''
                      )}
                      onClick={() => handldEventClick(event.payloadId)}
                    >
                      {/* <event.icon aria-hidden='true' className='h-5 w-5 text-white' /> */}
                      {/* {event.icon} */}
                      <p className='text-sm text-gray-500 px-4 py-2'>{event.content} </p>
                    </div>{' '}
                  </div>
                  {/* <div className='flex min-w-0 flex-1 justify-between space-x-4 pt-1.5'>
                  <div>
                    <p className='text-sm text-gray-500'>{event.content} </p>
                  </div>
                  <div className='whitespace-nowrap text-right text-sm text-gray-500'>
                    <time dateTime={event.datetime}>{event.datetime}</time>
                  </div>
                </div> */}
                </div>
              </Tooltip>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Example Usage:

// const exampleTimeline: TimelineEvent[] = [
//   {
//     id: 1,
//     content: 'Applied to',
//     target: 'Front End Developer',
//     href: '#',
//     date: 'Sep 20',
//     datetime: '2020-09-20',
//     icon: UserIcon,
//     iconBackground: 'bg-gray-400',
//   },
//   {
//     id: 2,
//     content: 'Advanced to phone screening by',
//     target: 'Bethany Blake',
//     href: '#',
//     date: 'Sep 22',
//     datetime: '2020-09-22',
//     icon: HandThumbUpIcon,
//     iconBackground: 'bg-blue-500',
//   },
//   {
//     id: 3,
//     content: 'Completed phone screening with',
//     target: 'Martha Gardner',
//     href: '#',
//     date: 'Sep 28',
//     datetime: '2020-09-28',
//     icon: CheckIcon,
//     iconBackground: 'bg-green-500',
//   },
//   {
//     id: 4,
//     content: 'Advanced to interview by',
//     target: 'Bethany Blake',
//     href: '#',
//     date: 'Sep 30',
//     datetime: '2020-09-30',
//     icon: HandThumbUpIcon,
//     iconBackground: 'bg-blue-500',
//   },
//   {
//     id: 5,
//     content: 'Completed interview with',
//     target: 'Katherine Snyder',
//     href: '#',
//     date: 'Oct 4',
//     datetime: '2020-10-04',
//     icon: CheckIcon,
//     iconBackground: 'bg-green-500',
//   },
// ];

// const Example = () => {
//   return <Timeline timeline={exampleTimeline} />;
// };

export default Timeline;