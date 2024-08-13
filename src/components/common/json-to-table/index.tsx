import React from 'react';

type Props = { data: Record<string, boolean | string | number | string[]> };

const keyClassName = 'font-bold px-4';
const valueClassName = 'py-2';
const rowClassName = 'even:bg-gray-50';

export const JsonToTable = ({ data }: Props) => {
  return (
    <table className='w-full border-y border-gray-50'>
      <tbody>
        {Object.entries(data).map(([key, value]) => {
          if (Array.isArray(value)) {
            return value.length > 0 ? (
              <React.Fragment key={key}>
                <tr className={rowClassName}>
                  <td className={keyClassName}>{key}</td>
                  <td className={valueClassName}>
                    {value.map((item, idx) => (
                      <div className='py-2' key={idx}>
                        {item}
                      </div>
                    ))}
                  </td>
                </tr>
              </React.Fragment>
            ) : (
              <tr className={rowClassName} key={key}>
                <td className={keyClassName}>{key}</td>
                <td className={valueClassName}>{'-'}</td>
              </tr>
            );
          } else {
            return (
              <tr className={rowClassName} key={key}>
                <td className={keyClassName}>{key}</td>
                <td className={valueClassName}>{value.toString()}</td>
              </tr>
            );
          }
        })}
      </tbody>
    </table>
  );
};
