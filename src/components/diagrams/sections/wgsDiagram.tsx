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

  // 'DRAGEN_WGS_QC',
  //   'TUMOR_NORMAL',
  //   'UMCCRISE',
  //   'ONCOANALYSER_WGS',
  //   'SASH',
  //   'ONCOANALYSER_WGTS_EXISTING_BOTH',
  {
    id: '4',
    type: 'workflow',
    data: {
      type: 'WGS_ALIGNMENT_QC',
      title: 'WGS_ALIGNMENT_QC',
      handlers: [
        {
          type: 'source',
          position: Position.Right,
          id: 'WGS_ALIGNMENT_QC-handle-1',
        },
        {
          type: 'target',
          position: Position.Left,
          id: 'WGS_ALIGNMENT_QC-handle-0',
        },
      ],
      details: {
        status: 'In Progress',
        description: 'TUMOR_NORMAL failed to complete',
      },
    },
    draggable: true,
    selectable: true,
    position: { x: 1000, y: 100 },
  },
  {
    id: '5',
    type: 'workflow',
    data: {
      type: 'WGS_TUMOR_NORMAL',
      title: 'WGS_TUMOR_NORMAL',
      handlers: [
        {
          type: 'target',
          position: Position.Left,
          id: 'WGS_TUMOR_NORMAL-handle-0',
        },
        {
          type: 'source',
          position: Position.Right,
          id: 'WGS_TUMOR_NORMAL-handle-1',
        },
        {
          type: 'source',
          position: Position.Bottom,
          id: 'WGS_TUMOR_NORMAL-handle-2',
        },
      ],

      details: {
        status: 'Failed',
        description: 'WGS_TUMOR_NORMAL failed to complete',
      },
    },
    draggable: true,
    selectable: true,
    position: { x: 1400, y: 100 },
  },
  {
    id: '6',
    type: 'workflow',
    data: {
      type: 'UMCCRISE',
      title: 'UMCCRISE',
      handlers: [
        {
          type: 'target',
          position: Position.Left,
          id: 'UMCCRISE-handle-0',
        },
      ],

      details: {
        status: 'Failed',
        // description: 'this is a description',
      },
    },
    draggable: true,
    selectable: true,
    position: { x: 1800, y: 100 },
  },
  {
    id: '7',
    type: 'workflow',
    data: {
      type: 'ONCOANALYSER_WGS',
      title: 'ONCOANALYSER_WGS',
      handlers: [
        {
          type: 'target',
          position: Position.Top,
          id: 'ONCOANALYSER_WGS-handle-0',
        },
        {
          type: 'source',
          position: Position.Right,
          id: 'ONCOANALYSER_WGS-handle-1',
        },
        {
          type: 'source',
          position: Position.Bottom,
          id: 'ONCOANALYSER_WGS-handle-2',
        },
      ],

      details: {
        status: 'Failed',
        description: 'ONCOANALYSER_WGS failed to complete',
      },
    },
    draggable: true,
    selectable: true,
    position: { x: 1400, y: 300 },
  },
  {
    id: '8',
    type: 'workflow',
    data: {
      type: 'SASH',
      title: 'SASH',
      handlers: [
        {
          type: 'target',
          position: Position.Left,
          id: 'SASH-handle-0',
        },
      ],

      details: {
        status: 'Succeeded',
        description: 'SASH failed to complete',
      },
    },
    draggable: true,
    selectable: true,
    position: { x: 1800, y: 300 },
  },
  {
    id: '9',
    type: 'workflow',
    data: {
      type: 'ONCOANALYSER_WGTS_BOTH',
      title: 'ONCOANALYSER_WGTS_EXISTING_BOTH',
      handlers: [
        {
          type: 'target',
          position: Position.Top,
          id: 'ONCOANALYSER_WGTS_EXISTING_BOTH-handle-1',
        },
      ],

      details: {
        status: 'Failed',
        description: 'ONCOANALYSER_WGTS_EXISTING_BOTH failed to complete',
      },
    },
    draggable: true,
    selectable: true,
    position: { x: 1400, y: 500 },
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
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    type: 'smoothstep',
    sourceHandle: 'BCL_CONVERT-handle-1',
    targetHandle: 'WGS_ALIGNMENT_QC-handle-0',
    animated: true,
    markerEnd: 'arrow',
  },
  {
    id: 'e4-5',
    source: '4',
    target: '5',
    type: 'smoothstep',
    sourceHandle: 'WGS_ALIGNMENT_QC-handle-1',
    targetHandle: 'WGS_TUMOR_NORMAL-handle-0',
    animated: true,
    markerEnd: 'arrow',
  },
  {
    id: 'e5-6',
    source: '5',
    target: '6',
    type: 'smoothstep',
    sourceHandle: 'WGS_TUMOR_NORMAL-handle-1',
    targetHandle: 'UMCCRISE-handle-0',
    animated: true,
    markerEnd: 'arrow',
  },
  {
    id: 'e5-7',
    source: '5',
    target: '7',
    type: 'smoothstep',
    sourceHandle: 'WGS_TUMOR_NORMAL-handle-2',
    targetHandle: 'ONCOANALYSER_WGS-handle-0',
    animated: true,
    markerEnd: 'arrow',
  },
  {
    id: 'e7-8',
    source: '7',
    target: '8',
    type: 'smoothstep',
    sourceHandle: 'ONCOANALYSER_WGS-handle-1',
    targetHandle: 'SASH-handle-0',
    animated: true,
    markerEnd: 'arrow',
  },
  {
    id: 'e7-9',
    source: '7',
    target: '9',
    type: 'smoothstep',
    sourceHandle: 'ONCOANALYSER_WGS-handle-2',
    targetHandle: 'ONCOANALYSER_WGTS_EXISTING_BOTH-handle-1',
    animated: true,
    markerEnd: 'arrow',
  },
] satisfies Edge[];
