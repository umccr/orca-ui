import { Position, Edge, Node } from '@xyflow/react';
export const nodes = [
  {
    id: '3',
    type: 'workflow',
    data: {
      type: 'BCL_CONVERT',
      title: 'BCL_CONVERT',
      handlers: [
        {
          type: 'target',
          position: Position.Left,
          id: 'BCL_CONVERT-handle-0',
        },
        {
          type: 'source',
          position: Position.Right,
          id: 'BCL_CONVERT-handle-1',
        },
      ],
      detail: {
        status: 'SUCCEEDED',
        description: 'Bcl convert succeded',
      },
    },
    draggable: true,
    selectable: true,
    position: { x: 600, y: 100 },
  },
  {
    id: '4',
    type: 'workflow',
    data: {
      type: 'TSO_CTDNA_TUMOR_ONLY',
      title: 'TSO_CTDNA_TUMOR_ONLY',
      handlers: [
        {
          type: 'target',
          position: Position.Left,
          id: 'TSO_CTDNA_TUMOR_ONLY-handle-0',
        },
        {
          type: 'source',
          position: Position.Right,
          id: 'TSO_CTDNA_TUMOR_ONLY-handle-1',
        },
      ],
      detail: {
        status: 'SUCCEEDED',
        description: 'TSO_CTDNA_TUMOR_ONLY succeded',
      },
    },
    draggable: true,
    selectable: true,
    position: { x: 950, y: 100 },
  },
] satisfies Node[];

export const edges = [
  // {
  //   id: 'e1-2',
  //   source: '1',
  //   target: '2',
  //   type: 'smoothstep',
  //   sourceHandle: 'Sequencer-handle-0',
  //   animated: true,
  //   markerEnd: 'arrow',
  // },
  // {
  //   id: 'e2-3',
  //   source: '2',
  //   target: '3',
  //   type: 'smoothstep',
  //   sourceHandle: 'BSSH-handle-0',
  //   targetHandle: 'BCL_CONVERT-handle-0',
  //   animated: true,
  //   markerEnd: 'arrow',
  // },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    type: 'smoothstep',
    sourceHandle: 'BCL_CONVERT-handle-1',
    targetHandle: 'TSO_CTDNA_TUMOR_ONLY-handle-0',
    animated: true,
    markerEnd: 'arrow',
  },
  // {
  //   id: 'e4-5',
  //   source: '4',
  //   target: '5',
  //   type: 'smoothstep',
  //   sourceHandle: 'TSO_CTDNA_TUMOR_ONLY-handle-1',
  //   targetHandle: 'UMCCRISE-handle-0',
  //   animated: true,
  //   markerEnd: 'arrow',
  // },
] satisfies Edge[];
