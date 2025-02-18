import { FC, useState, useEffect, ReactNode } from 'react';
import { classNames } from '@/utils/commonUtils';
import { ChatBubbleBottomCenterTextIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
// import { Badge } from '@/components/common/badges';
import { dayjs } from '@/utils/dayjs';

export interface TimelineEvent {
  id: string;
  content: ReactNode;
  comment?: string;
  status?: string;
  datetime: string;
  iconBackground?: string;
  payloadId?: string;
  eventType?: 'stateChange' | 'comment';

  title?: string;
  subtitle?: string;
  tags?: string[];
  user?: {
    name: string;
    avatar?: string;
  };
}

export interface TimelineProps {
  timeline: TimelineEvent[];
  handldEventClick?: (event: TimelineEvent) => void;
  selectId?: string;
}

const Timeline: FC<TimelineProps> = ({ timeline, handldEventClick = undefined, selectId = '' }) => {
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
    if (handldEventClick) {
      handldEventClick(event);
    }
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
                  className='absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700'
                />
              ) : null}

              <div
                className={classNames(
                  'relative flex space-x-3',
                  'cursor-pointer rounded-lg p-0 transition-all duration-200'
                )}
                onClick={() => handleTimelineEventClick(event)}
              >
                <div>
                  <div
                    className={classNames(
                      event.iconBackground || 'bg-gray-100 dark:bg-gray-700',
                      'flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white dark:ring-gray-900',
                      selectedEventId === event.id
                        ? 'ring-2 ring-indigo-500 dark:ring-indigo-400'
                        : ''
                    )}
                  >
                    {event.eventType ? (
                      eventIcon(event.eventType)
                    ) : (
                      <CheckCircleIcon
                        aria-hidden='true'
                        className='h-5 w-5 text-green-500 dark:text-green-400'
                      />
                    )}
                  </div>
                </div>

                <div className='flex min-w-0 flex-1 flex-col'>
                  {/* Header Section */}
                  <div className='flex items-center justify-between space-x-4'>
                    <div className='flex items-center space-x-2'>
                      {event.user?.avatar && (
                        <img
                          src={event.user.avatar}
                          alt={event.user.name}
                          className='h-6 w-6 rounded-full'
                        />
                      )}
                      <div>
                        {event.title && (
                          <p className='text-sm font-medium text-gray-900 dark:text-gray-100'>
                            {event.title}
                          </p>
                        )}
                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                          {event.user?.name && `${event.user.name} • `}
                          <time dateTime={event.datetime} className='font-mono'>
                            {dayjs(event.datetime).format('MMM DD, YYYY hh:mm A')}
                          </time>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className='mt-2 space-y-3'>
                    <div className='text-sm text-gray-700 dark:text-gray-300'>{event.content}</div>

                    {/* Tags */}
                    {event.tags && event.tags.length > 0 && (
                      <div className='flex flex-wrap gap-2'>
                        {event.tags.map((tag, index) => (
                          <span
                            key={index}
                            className='inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Comment Section */}
                    {event.comment && (
                      <div className='rounded-md bg-gray-50 p-3 ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700'>
                        <pre
                          className={classNames(
                            'text-sm text-gray-600 dark:text-gray-300',
                            'whitespace-pre-wrap break-words', // Preserves formatting while allowing wrapping
                            'font-sans' // Keep the regular font instead of monospace
                          )}
                        >
                          {event.comment}
                        </pre>
                      </div>
                    )}
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
