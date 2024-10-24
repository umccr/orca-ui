import { FC, useState, useEffect, ReactNode } from 'react';
import { classNames } from '@/utils/commonUtils';
import { ChatBubbleBottomCenterTextIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
// import { Badge } from '@/components/common/badges';

export interface TimelineEvent {
  id: string;
  content: ReactNode;
  comment?: string;
  status?: string;
  datetime: string;
  iconBackground?: string;
  payloadId?: string;
  eventType?: 'stateChange' | 'comment';
}

export interface TimelineProps {
  timeline: TimelineEvent[];
  handldEventClick: (event: TimelineEvent) => void;
  selectId?: string;
}

const Timeline: FC<TimelineProps> = ({ timeline, handldEventClick, selectId = '' }) => {
  const [selectedEventId, setSelectedEventId] = useState<string>(timeline[0]?.id || '');
  useEffect(() => {
    if (selectId) {
      setSelectedEventId(selectId);
    }
  }, [selectId]);

  const eventIcon = (eventType: TimelineEvent['eventType'] | undefined) => {
    if (eventType === 'comment') {
      return (
        <ChatBubbleBottomCenterTextIcon aria-hidden='true' className='h-5 w-5 text-gray-500' />
      );
    }
    return <CheckCircleIcon aria-hidden='true' className='h-5 w-5 text-green-500' />;
  };

  const handleTimelineEventClick = (event: TimelineEvent) => {
    setSelectedEventId(event.id || '');
    handldEventClick(event);
  };

  return (
    <div className='flow-root'>
      <ul role='list' className='-mb-8'>
        {timeline.map((event, eventIdx) => (
          <li key={eventIdx}>
            <div className='relative pb-8'>
              {eventIdx !== timeline.length - 1 ? (
                <span
                  aria-hidden='true'
                  className='absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200'
                />
              ) : null}

              <div
                className={classNames('relative flex space-x-3', 'cursor-pointer')}
                onClick={() => handleTimelineEventClick(event)}
              >
                <div>
                  <div
                    className={classNames(
                      event.iconBackground,
                      'flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white',
                      selectedEventId === event.id ? ' ring-2 ring-indigo-500' : ''
                    )}
                  >
                    {event.eventType ? (
                      eventIcon(event.eventType)
                    ) : (
                      <CheckCircleIcon aria-hidden='true' className='h-5 w-5 text-green-500' />
                    )}
                    {/* {event.icon} */}
                    {/* <p className='text-sm text-gray-500 px-4 py-2'>{event.content} </p> */}
                  </div>{' '}
                </div>
                <div>
                  <div className='flex flex-col min-w-0 flex-1 justify-between py-1 pr-4'>
                    <div>
                      {/* <Badge
                      status={event.content}
                      className={
                        selectedEventPayloadId === event.payloadId ? 'ring-2 ring-indigo-500' : ''
                      }
                    > */}
                      {event.content}

                      {/* <div className='text-sm text-gray-500'>{event.content} </div> */}
                    </div>
                    <div className='whitespace-nowrap text-left text-sm text-gray-500 '>
                      <time dateTime={event.datetime}>{event.datetime}</time>
                    </div>
                    <div className='flex-auto rounded-md py-1 px-2 ring-1 ring-inset ring-gray-200'>
                      <div className='whitespace-nowrap text-left text-sm text-gray-500 max-w-sm text-wrap'>
                        {event.comment}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
