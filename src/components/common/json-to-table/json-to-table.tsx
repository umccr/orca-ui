/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

const JsonToTable = ({ data }: { data: Record<string, any> }) => {
  const keyClassName = 'font-bold px-4 py-3 text-sm text-gray-700 dark:text-gray-300';
  const valueClassName = 'px-4 py-3 text-sm text-gray-600 dark:text-gray-400';
  const rowClassName =
    'border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors';

  const renderValue = (value: any) => {
    if (!value) {
      return <span className='text-gray-400 dark:text-gray-500'>-</span>;
    }

    if (React.isValidElement(value)) {
      return value;
    }

    if (Array.isArray(value)) {
      return value.length > 0 ? (
        value.map((item, idx) => (
          <div className={`${idx === 0 ? '' : 'mt-2'} text-gray-600 dark:text-gray-400`} key={idx}>
            {item}
          </div>
        ))
      ) : (
        <span className='text-gray-400 dark:text-gray-500'>-</span>
      );
    }

    if (typeof value === 'object') {
      return <JsonToTable data={value} />;
    }

    return <span className='text-gray-600 dark:text-gray-400'>{value.toString()}</span>;
  };

  return (
    <table className='w-full overflow-hidden rounded-lg border border-gray-200 shadow-sm dark:border-gray-700'>
      <tbody className='divide-y divide-gray-100 bg-white dark:divide-gray-700 dark:bg-gray-900'>
        {Object.entries(data).map(([key, value]) => (
          <tr className={rowClassName} key={key}>
            <td className={keyClassName}>{key}</td>
            <td className={valueClassName}>{renderValue(value)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default JsonToTable;
