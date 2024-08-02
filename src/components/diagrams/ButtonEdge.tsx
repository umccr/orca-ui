import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  //   getBezierPath,
  useReactFlow,
  getSmoothStepPath,
} from '@xyflow/react';

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const { setEdges } = useReactFlow();

  const [edgePath2, labelX2, labelY2] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = () => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      <BaseEdge
        path={edgePath2}
        markerEnd={markerEnd}
        style={style}
        className='hover:z-50 hover:border-8'
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX2}px,${labelY2}px)`,
            fontSize: 12,
            // everything inside EdgeLabelRenderer has no pointer events by default
            // if you have an interactive element, set pointer-events: all
            pointerEvents: 'all',
          }}
          className='nodrag nopan '
        >
          <button className='edgebutton' onClick={onEdgeClick}>
            x
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
