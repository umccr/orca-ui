/* eslint-disable @typescript-eslint/no-explicit-any */

import { FC, useEffect, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import type { DateTimePickerProps } from 'react-flatpickr';
import { dayjs } from '@/utils/dayjs';

interface DateRangePickerProps {
  align?: string;
  startDate: string | null;
  endDate: string | null;
  onTimeChange: (startDate: string | null, endDate: string | null) => void;
}

const DateRangePicker: FC<DateRangePickerProps> = ({ align, startDate, endDate, onTimeChange }) => {
  const [selectedStartDate, setSelectedStartDate] = useState<string | null>(startDate);
  // dayjs().subtract(1, 'years').format('YYYY-MM-DDTHH:mm:ss[Z]')
  const [selectedEndDate, setSelectedEndDate] = useState<string | null>(endDate);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    setSelectedStartDate(startDate);
    setSelectedEndDate(endDate);
  }, [startDate, endDate]);

  const options: Partial<DateTimePickerProps['options']> = {
    mode: 'range',
    static: true,
    monthSelectorType: 'static',
    dateFormat: 'j M Y',
    // defaultDate: `${dayjs().subtract(1, 'month').format('DD/MM/YYYY')} to ${new Date().toLocaleDateString()}`,
    prevArrow:
      '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
    nextArrow:
      '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
    onReady: (_selectedDates, dateStr, instance) => {
      (instance.element as HTMLInputElement).value = dateStr.replace('to', '-');
      const customClass = align ? align : '';
      instance.calendarContainer.classList.add(`flatpickr-${customClass}`);
      // console.log('on ready', selectedDates);
    },
    onValueUpdate: (_selectedDates, dateStr, instance) => {
      (instance.element as HTMLInputElement).value = dateStr.replace('to', '-');
      // console.log('on value update', selectedDates);
    },
    onChange: (selectedDates) => {
      if (selectedDates.length === 2) {
        onTimeChange(
          dayjs(selectedDates[0]).utc(true).format(),
          dayjs(selectedDates[1]).utc(true).format()
        );
      }
    },
  };

  const FlatpickrComponent = Flatpickr as any;

  return (
    <div className='relative'>
      <FlatpickrComponent
        className='form-input w-[15.5rem] rounded-lg border-0 bg-white py-1.5 !pl-9 font-medium text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 hover:bg-magpie-light-25 hover:text-slate-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-200'
        options={options}
        value={
          selectedStartDate && selectedEndDate
            ? [new Date(selectedStartDate), new Date(selectedEndDate)]
            : isOpen
              ? ''
              : new Date()
        }
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
      />
      <div className='pointer-events-none absolute inset-0 right-auto flex items-center'>
        <svg
          className='ml-3 h-4 w-4 fill-current text-slate-500 dark:text-slate-400'
          viewBox='0 0 16 16'
        >
          <path d='M15 2h-2V0h-2v2H9V0H7v2H5V0H3v2H1a1 1 0 00-1 1v12a1 1 0 001 1h14a1 1 0 001-1V3a1 1 0 00-1-1zm-1 12H2V6h12v8z' />
        </svg>
      </div>
    </div>
  );
};

export default DateRangePicker;
