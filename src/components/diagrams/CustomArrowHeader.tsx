const CustomArrowHeader = () => {
  return (
    <svg style={{ position: 'absolute', top: 0, left: 0 }}>
      <defs>
        <marker
          id='arrow'
          viewBox='0 0 15 10'
          refX='10'
          refY='5'
          markerWidth='13'
          markerHeight='10'
          orient='auto-start-reverse'
        >
          <path d='M 0 0 L 15 5 L 0 10 L 3 5 z' />
        </marker>
        <marker
          id='diamond'
          viewBox='0 0 20 10'
          refX='15'
          refY='5'
          markerWidth='15'
          markerHeight='10'
          orient='auto-start-reverse'
        >
          <path d='M 10 0 L 20 5 L 10 10 L 0 5 z' />
        </marker>
        <marker
          id='double-arrow'
          viewBox='0 0 20 10'
          refX='15'
          refY='5'
          markerWidth='15'
          markerHeight='10'
          orient='auto-start-reverse'
        >
          <path d='M 10 0 L 20 5 L 10 10 z' />
          <path d='M 0 0 L 10 5 L 0 10 z' />
        </marker>
      </defs>
    </svg>
  );
};

export default CustomArrowHeader;
