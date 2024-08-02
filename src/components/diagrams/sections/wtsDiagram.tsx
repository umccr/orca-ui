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
  //   'RNASUM',
  //   'ONCOANALYSER_WTS',
  //   'SASH',
  //   'ONCOANALYSER_WGTS_EXISTING_BOTH',
  {
    id: '4',
    type: 'workflow',
    data: {
      type: 'WTS_ALIGNMENT_QC',
      title: 'WTS_ALIGNMENT_QC',
      handlers: [
        {
          type: 'target',
          position: Position.Left,
          id: 'WTS_ALIGNMENT_QC-handle-0',
        },
        {
          type: 'source',
          position: Position.Right,
          id: 'WTS_ALIGNMENT_QC-handle-1',
        },
        {
          type: 'source',
          position: Position.Bottom,
          id: 'WTS_ALIGNMENT_QC-handle-2',
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
      type: 'WTS_TUMOR_ONLY',
      title: 'WTS_TUMOR_ONLY',
      handlers: [
        {
          type: 'target',
          position: Position.Left,
          id: 'WTS_TUMOR_ONLY-handle-0',
        },
        {
          type: 'source',
          position: Position.Right,
          id: 'WTS_TUMOR_ONLY-handle-1',
        },
        {
          type: 'source',
          position: Position.Bottom,
          id: 'WTS_TUMOR_ONLY-handle-2',
        },
      ],

      details: {
        status: 'Failed',
        description: 'WTS_TUMOR_ONLY failed to complete',
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
      type: 'RNASUM',
      title: 'RNASUM',
      handlers: [
        {
          type: 'target',
          position: Position.Left,
          id: 'RNASUM-handle-0',
        },
      ],

      details: {
        status: 'Failed',
        // description: 'this is a description',
      },
    },
    draggable: true,
    selectable: true,
    position: { x: 1820, y: 100 },
  },
  {
    id: '7',
    type: 'workflow',
    data: {
      type: 'STAR_ALIGNMENT',
      title: 'STAR_ALIGNMENT',
      handlers: [
        {
          type: 'target',
          position: Position.Top,
          id: 'STAR_ALIGNMENT-handle-0',
        },
        {
          type: 'source',
          position: Position.Right,
          id: 'STAR_ALIGNMENT-handle-1',
        },
      ],
      details: {
        status: 'Succeeded',
        description: 'SASH failed to complete',
      },
    },
    draggable: true,
    selectable: true,
    position: { x: 1000, y: 300 },
  },
  {
    id: '8',
    type: 'workflow',
    data: {
      type: 'ONCOANALYSER_WTS',
      title: 'ONCOANALYSER_WTS',
      handlers: [
        {
          type: 'target',
          position: Position.Left,
          id: 'ONCOANALYSER_WTS-handle-0',
        },
        {
          type: 'source',
          position: Position.Right,
          id: 'ONCOANALYSER_WTS-handle-1',
        },
      ],
      details: {
        status: 'Failed',
        description: 'ONCOANALYSER_WTS failed to complete',
      },
    },
    draggable: true,
    selectable: true,
    position: { x: 1350, y: 300 },
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
          position: Position.Left,
          id: 'ONCOANALYSER_WGTS_EXISTING_BOTH-handle-0',
        },
      ],

      details: {
        status: 'Failed',
        description: 'ONCOANALYSER_WGTS_EXISTING_BOTH failed to complete',
      },
    },
    draggable: true,
    selectable: true,
    position: { x: 1700, y: 300 },
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
    targetHandle: 'WTS_ALIGNMENT_QC-handle-0',
    animated: true,
    markerEnd: 'arrow',
  },
  {
    id: 'e4-5',
    source: '4',
    target: '5',
    type: 'smoothstep',
    sourceHandle: 'WTS_ALIGNMENT_QC-handle-1',
    targetHandle: 'WTS_TUMOR_ONLY-handle-0',
    animated: true,
    markerEnd: 'arrow',
  },
  {
    id: 'e5-6',
    source: '5',
    target: '6',
    type: 'smoothstep',
    sourceHandle: 'WTS_TUMOR_ONLY-handle-1',
    targetHandle: 'RNASUM-handle-0',
    animated: true,
    markerEnd: 'arrow',
  },
  {
    id: 'e4-7',
    source: '4',
    target: '7',
    type: 'smoothstep',
    sourceHandle: 'WTS_ALIGNMENT_QC-handle-2',
    targetHandle: 'STAR_ALIGNMENT-handle-0',
    animated: true,
    markerEnd: 'arrow',
  },
  {
    id: 'e7-8',
    source: '7',
    target: '8',
    type: 'smoothstep',
    sourceHandle: 'STAR_ALIGNMENT-handle-1',
    targetHandle: 'ONCOANALYSER_WTS-handle-0',
    animated: true,
    markerEnd: 'arrow',
  },
  {
    id: 'e8-9',
    source: '8',
    target: '9',
    type: 'smoothstep',
    sourceHandle: 'ONCOANALYSER_WTS-handle-1',
    targetHandle: 'ONCOANALYSER_WGTS_EXISTING_BOTH-handle-0',
    animated: true,
    markerEnd: 'arrow',
  },
] satisfies Edge[];
