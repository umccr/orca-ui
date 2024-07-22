import { Position, Edge, Node } from '@xyflow/react';

export const nodes = [
  {
    id: '1',
    type: 'workflow',
    data: {
      type: 'Sequencer',
      title: 'Sequencer',
      handlers: [
        {
          type: 'source',
          position: Position.Right,
          id: 'Sequencer-handle-0',
        },
      ],
      detail: {
        status: 'SUCCEEDED',
        // description: 'this is a description',
      },
    },
    draggable: true,
    selectable: true,
    position: { x: 0, y: 100 },
  },

  {
    id: '2',
    type: 'workflow',
    data: {
      type: 'BSSH',
      title: 'BSSH',
      handlers: [
        {
          type: 'source',
          position: Position.Right,
          id: 'BSSH-handle-0',
        },
        {
          type: 'target',
          position: Position.Left,
          id: 'BSSH-handle-1',
        },
      ],
      detail: {
        status: 'SUCCEEDED',
        // description: 'this is a description',
      },
    },
    draggable: true,
    selectable: true,
    position: { x: 250, y: 100 },
  },
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
        description: 'this is a description',
      },
    },
    draggable: true,
    selectable: true,
    position: { x: 600, y: 100 },
  },
] satisfies Node[];

export const edges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'smoothstep',
    sourceHandle: 'Sequencer-handle-0',
    animated: true,
    markerEnd: 'arrow',
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    type: 'smoothstep',
    sourceHandle: 'BSSH-handle-0',
    targetHandle: 'BCL_CONVERT-handle-0',
    animated: true,
    markerEnd: 'arrow',
  },
] satisfies Edge[];
