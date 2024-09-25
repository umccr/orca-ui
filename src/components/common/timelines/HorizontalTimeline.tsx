import { FC, useState, useEffect, useRef, useCallback } from 'react';
import { classNames } from '@/utils/commonUtils';
import { CheckCircleIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Badge } from '@/components/common/badges';

interface TimelineEvent {
  id: number;
  content: string;
  comment?: string;
  datetime: string;
  iconBackground: string;
  payloadId: number;
  icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

interface TimelineProps {
  timeline: TimelineEvent[];
  handldEventClick: (id: number) => void;
  selectId: number | null;
}

const HorizontalTimeline: FC<TimelineProps> = ({ timeline, handldEventClick, selectId }) => {
  const [selectedEventPayloadId, setSelectedEventPayloadId] = useState<number | null>(selectId);
  const [translateX, setTranslateX] = useState(0);
  const timelineRef = useRef<HTMLUListElement>(null);

  const calculateInitialPosition = useCallback(() => {
    if (timelineRef.current) {
      const containerWidth = timelineRef.current.clientWidth;
      const scrollWidth = timelineRef.current.scrollWidth;
      const initialTranslateX = containerWidth - scrollWidth;
      setTranslateX(Math.min(0, initialTranslateX)); // Ensure it's not positive
    }
  }, []);

  useEffect(() => {
    if (timelineRef.current && selectId && selectId === timeline[timeline.length - 1].payloadId) {
      calculateInitialPosition();
      window.addEventListener('resize', calculateInitialPosition);
      return () => window.removeEventListener('resize', calculateInitialPosition);
    }
  }, [calculateInitialPosition, timelineRef, timeline, selectId]);

  useEffect(() => {
    if (selectId) {
      setSelectedEventPayloadId(selectId);
    }
  }, [selectId]);

  const scroll = (direction: 'left' | 'right') => {
    const scrollAmount = 200; // Adjust this value to control scroll distance
    if (timelineRef.current) {
      const maxScroll = timelineRef.current.scrollWidth - timelineRef.current.clientWidth;
      const newTranslateX =
        direction === 'left'
          ? Math.min(0, translateX + scrollAmount)
          : Math.max(-maxScroll, translateX - scrollAmount);
      setTranslateX(newTranslateX);
    }
  };

  return (
    <div className='relative'>
      <button
        onClick={() => scroll('left')}
        className='absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md z-10'
        aria-label='Scroll left'
      >
        <ChevronLeftIcon className='h-6 w-6 text-gray-600' />
      </button>
      <div className='overflow-hidden'>
        <ul
          ref={timelineRef}
          role='list'
          className='flex space-x-2 py-2 px-4 transition-transform duration-300 ease-in-out'
          style={{ transform: `translateX(${translateX}px)` }}
        >
          {timeline.map((event, eventIdx) => (
            <li key={event.id} className='relative flex-shrink-0 px-4 '>
              {eventIdx !== timeline.length - 1 ? (
                <span
                  aria-hidden='true'
                  className='absolute top-4 left-24 h-0.5 w-full bg-gray-200'
                />
              ) : null}

              <div
                className={classNames(
                  'relative flex flex-col items-center space-y-3',
                  'cursor-pointer'
                )}
                onClick={() => handldEventClick(event.payloadId)}
              >
                <div>
                  <div
                    className={classNames(
                      event.iconBackground,
                      'flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white '
                    )}
                  >
                    {event.icon ? (
                      <event.icon aria-hidden='true' className='h-5 w-5 text-white' />
                    ) : (
                      <CheckCircleIcon aria-hidden='true' className='h-5 w-5 text-green-500' />
                    )}
                  </div>
                </div>
                <div
                  className={classNames(
                    'flex flex-col items-center ',
                    selectedEventPayloadId === event.payloadId
                      ? 'border-b-2 border-indigo-500'
                      : 'hover:border-b-2 hover:border-indigo-200'
                  )}
                >
                  <Badge
                    status={event.content}
                    className={
                      selectedEventPayloadId === event.payloadId ? 'ring-2 ring-indigo-500' : ''
                    }
                  >
                    {event.content}
                  </Badge>
                  <div className='whitespace-nowrap text-center text-sm text-gray-500'>
                    <time dateTime={event.datetime}>{event.datetime}</time>
                  </div>
                  <div className='whitespace-nowrap text-center text-sm text-gray-500'>
                    {event.comment}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={() => scroll('right')}
        className='absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md z-10'
        aria-label='Scroll right'
      >
        <ChevronRightIcon className='h-6 w-6 text-gray-600' />
      </button>
    </div>
  );
};

export default HorizontalTimeline;
