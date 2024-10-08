/* eslint-disable @typescript-eslint/no-explicit-any */
const keyClassName = 'font-bold px-4';
const valueClassName = 'py-2';
const rowClassName = 'even:bg-gray-50';

const JsonToTable = ({ data }: { data: Record<string, any> }) => {
  const renderValue = (value: any) => {
    if (!value) {
      return '-';
    }

    if (Array.isArray(value)) {
      return value.length > 0
        ? value.map((item, idx) => (
            <div className='py-2' key={idx}>
              {item}
            </div>
          ))
        : '-';
    }

    if (typeof value === 'object') {
      return <JsonToTable data={value} />;
    }

    return value.toString();
  };

  return (
    <table className='w-full border-2 border-gray-100'>
      <tbody>
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
