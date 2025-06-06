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
          position: Position.Top,
          id: 'BCL_CONVERT-handle-1',
          style: { left: '66%' },
        },
        {
          type: 'source',
          position: Position.Right,
          id: 'BCL_CONVERT-handle-2',
          style: { top: '25%' },
        },
        {
          type: 'source',
          position: Position.Right,
          id: 'BCL_CONVERT-handle-3',
          style: { top: '50%' },
        },
        {
          type: 'source',
          position: Position.Right,
          id: 'BCL_CONVERT-handle-4',
          style: { top: '75%' },
        },
        {
          type: 'source',
          position: Position.Bottom,
          id: 'BCL_CONVERT-handle-5',
          style: { left: '33%' },
        },
        {
          type: 'source',
          position: Position.Bottom,
          id: 'BCL_CONVERT-handle-6',
          style: { left: '66%' },
        },
      ],
      detail: {
        status: 'unknown',
        description: 'this is a description',
      },
    },
    draggable: true,
    selectable: true,
    position: { x: 450, y: 480 },
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
        // {
        //   type: 'source',
        //   position: Position.Right,
        //   id: 'TSO_CTDNA_TUMOR_ONLY-handle-1',
        // },
        // {
        //   type: 'source',
        //   position: Position.Top,
        //   id: 'TSO_CTDNA_TUMOR_ONLY-handle-2',
        // },
      ],
      detail: {
        status: 'unknown',
        description: 'this is a description',
      },
    },
    draggable: true,
    selectable: true,
    position: { x: 770, y: 250 },
  },
  {
    id: '5',
    type: 'workflow',
    data: {
      type: 'WGS_ALIGNMENT_QC',
      title: 'WGS_ALIGNMENT_QC',
      handlers: [
        {
          type: 'target',
          position: Position.Left,
          id: 'WGS_ALIGNMENT_QC-handle-0',
        },
        {
          type: 'source',
          position: Position.Right,
          id: 'WGS_ALIGNMENT_QC-handle-1',
        },
        {
          type: 'source',
          position: Position.Bottom,
          id: 'WGS_ALIGNMENT_QC-handle-2',
        },
      ],
      detail: {
        status: 'unknown',
        description: 'this is a description',
      },
    },
    draggable: true,
    selectable: true,
    position: { x: 770, y: 400 },
  },
  {
    id: '6',
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
          style: { left: '33%' },
        },
        {
          type: 'source',
          position: Position.Bottom,
          id: 'WTS_ALIGNMENT_QC-handle-3',
          style: { left: '66%' },
        },
      ],
      detail: {
        status: 'unknown',
        description: 'this is a description',
      },
    },
    draggable: true,
    selectable: true,
    position: { x: 770, y: 550 },
  },
  {
    id: '7',
    type: 'workflow',
    data: {
      type: 'WGS_TUMOR_NORMAL',
      title: 'WGS_TUMOR_NORMAL',
      handlers: [
        {
          type: 'target',
          position: Position.Left,
          id: 'WGS_TUMOR_NORMAL-handle-0',
          style: { top: '33%' },
        },
        {
          type: 'target',
          position: Position.Left,
          id: 'WGS_TUMOR_NORMAL-handle-1',
          style: { top: '66%' },
        },
        {
          type: 'source',
          position: Position.Right,
          id: 'WGS_TUMOR_NORMAL-handle-2',
        },
        {
          type: 'source',
          position: Position.Bottom,
          id: 'WGS_TUMOR_NORMAL-handle-3',
          style: { left: '25%' },
        },
        {
          type: 'source',
          position: Position.Bottom,
          id: 'WGS_TUMOR_NORMAL-handle-4',
          style: { left: '50%' },
        },
        {
          type: 'source',
          position: Position.Bottom,
          id: 'WGS_TUMOR_NORMAL-handle-5',
          style: { left: '75%' },
        },
      ],
      detail: {
        status: 'unknown',
        description: 'this is a description',
      },
    },
    draggable: true,
    selectable: true,
    position: { x: 1180, y: 300 },
  },
  {
    id: '8',
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
        {
          type: 'source',
          position: Position.Right,
          id: 'UMCCRISE-handle-1',
        },
      ],
      detail: {
        status: 'unknown',
        description: 'this is a description',
      },
    },
    draggable: true,
    selectable: true,
    position: { x: 1480, y: 300 },
  },
  {
    id: '9',
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
        {
          type: 'target',
          position: Position.Bottom,
          id: 'RNASUM-handle-1',
        },
      ],
      detail: {
        status: 'unknown',
        description: 'this is a description',
      },
    },
    draggable: true,
    selectable: true,
    position: { x: 1900, y: 300 },
  },
  {
    id: '10',
    type: 'workflow',
    data: {
      type: 'WTS_TUMOR_ONLY',
      title: 'WTS_TUMOR_ONLY',
      handlers: [
        {
          type: 'target',
          position: Position.Left,
          id: 'WTS_TUMOR_ONLY-handle-0',
          style: { top: '33%' },
        },
        {
          type: 'target',
          position: Position.Left,
          id: 'WTS_TUMOR_ONLY-handle-1',
          style: { top: '66%' },
        },
        {
          type: 'source',
          position: Position.Right,
          id: 'WTS_TUMOR_ONLY-handle-2',
        },
      ],
      detail: {
        status: 'unknown',
        description: 'this is a description',
      },
    },
    draggable: true,
    selectable: true,
    position: { x: 1180, y: 550 },
  },
  {
    id: '11',
    type: 'workflow',
    data: {
      type: 'STAR_ALIGNMENT',
      title: 'STAR_ALIGNMENT',
      handlers: [
        {
          type: 'target',
          position: Position.Left,
          id: 'STAR_ALIGNMENT-handle-0',
        },
        {
          type: 'target',
          position: Position.Top,
          id: 'STAR_ALIGNMENT-handle-1',
        },
        {
          type: 'source',
          position: Position.Right,
          id: 'STAR_ALIGNMENT-handle-2',
        },
      ],
      detail: {
        status: 'unknown',
        description: 'this is a description',
      },
    },
    draggable: true,
    selectable: true,
    position: { x: 770, y: 800 },
  },

  {
    id: '14',
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
      detail: {
        status: 'unknown',
        description: 'this is a description',
      },
    },
    draggable: true,
    selectable: true,
    position: { x: 1130, y: 800 },
  },

  {
    id: '16',
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
      detail: {
        status: 'unknown',
        description: 'this is a description',
      },
    },
    draggable: true,
    selectable: true,
    position: { x: 1490, y: 640 },
  },
  {
    id: '17',
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
        {
          type: 'target',
          position: Position.Top,
          id: 'SASH-handle-1',
          style: { left: '33%' },
        },
      ],
      detail: {
        status: 'unknown',
        description: 'this is a description',
      },
    },
    draggable: true,
    selectable: true,
    position: { x: 1900, y: 650 },
  },
  {
    id: '18',
    type: 'workflow',
    data: {
      type: 'ONCOANALYSER_WGTS_BOTH',
      title: 'ONCOANALYSER_WGTS_EXISTING_BOTH',
      handlers: [
        {
          type: 'target',
          position: Position.Left,
          id: 'ONCOANALYSER_WGTS_EXISTING_BOTH-handle-0',
          style: { top: '33%' },
        },
        {
          type: 'target',
          position: Position.Left,
          id: 'ONCOANALYSER_WGTS_EXISTING_BOTH-handle-1',
          style: { top: '66%' },
        },
      ],
      detail: {
        status: 'unknown',
        description: 'this is a description',
      },
    },
    draggable: true,
    selectable: true,
    position: { x: 1770, y: 800 },
  },
  // {
  //   id: '20',
  //   type: 'default',
  //   className: 'annotation',
  //   data: {
  //     type: 'annotation',
  //     title: 'Workflow Digram Annotation goes here',
  //   },
  //   draggable: true,
  //   selectable: false,
  //   position: { x: 5, y: 400 },
  // },
] satisfies Node[];

export const edges = [
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
  {
    id: 'e3-5',
    source: '3',
    target: '5',
    type: 'smoothstep',
    sourceHandle: 'BCL_CONVERT-handle-2',
    targetHandle: 'WGS_ALIGNMENT_QC-handle-0',
    animated: true,
    markerEnd: 'arrow',
  },
  {
    id: 'e3-6',
    source: '3',
    target: '6',
    type: 'smoothstep',
    sourceHandle: 'BCL_CONVERT-handle-4',
    targetHandle: 'WTS_ALIGNMENT_QC-handle-0',
    animated: true,
    markerEnd: 'arrow',
  },
  {
    id: 'e5-7',
    source: '5',
    target: '7',
    type: 'smoothstep',
    sourceHandle: 'WGS_ALIGNMENT_QC-handle-2',
    targetHandle: 'WGS_TUMOR_NORMAL-handle-0',
    animated: true,
    markerEnd: 'double-arrow',
  },
  {
    id: 'e3-7',
    source: '3',
    target: '7',
    type: 'smoothstep',
    sourceHandle: 'BCL_CONVERT-handle-3',
    targetHandle: 'WGS_TUMOR_NORMAL-handle-1',
    label: 'use FASTQs as input',
    animated: true,
    markerEnd: 'diamond',
  },
  {
    id: 'e7-8',
    source: '7',
    target: '8',
    type: 'smoothstep',
    sourceHandle: 'WGS_TUMOR_NORMAL-handle-2',
    targetHandle: 'UMCCRISE-handle-0',
    animated: true,
    markerEnd: 'arrow',
  },
  {
    id: 'e8-9',
    source: '8',
    target: '9',
    type: 'smoothstep',
    sourceHandle: 'UMCCRISE-handle-1',
    targetHandle: 'RNASUM-handle-0',
    label: 'PANCAN',
    animated: true,
    markerEnd: 'arrow',
  },
  {
    id: 'e6-10',
    source: '6',
    target: '10',
    type: 'smoothstep',
    sourceHandle: 'WTS_ALIGNMENT_QC-handle-3',
    targetHandle: 'WTS_TUMOR_ONLY-handle-0',
    animated: true,
    markerEnd: 'double-arrow',
  },

  // {
  //   id: 'e4-13',
  //   source: '4',
  //   target: '13',
  //   type: 'smoothstep',
  //   sourceHandle: 'TSO_CTDNA_TUMOR_ONLY-handle-1',
  //   targetHandle: 'HOLMES-handle-0',
  //   animated: true,
  //   markerEnd: 'arrow',
  // },
  // {
  //   id: 'e5-13',
  //   source: '5',
  //   target: '13',
  //   type: 'smoothstep',
  //   sourceHandle: 'WGS_ALIGNMENT_QC-handle-1',
  //   targetHandle: 'HOLMES-handle-1',
  //   animated: true,
  //   markerEnd: 'arrow',
  // },
  // {
  //   id: 'e6-13',
  //   source: '6',
  //   target: '13',
  //   type: 'smoothstep',
  //   sourceHandle: 'WTS_ALIGNMENT_QC-handle-1',
  //   targetHandle: 'HOLMES-handle-2',
  //   animated: true,
  //   markerEnd: 'arrow',
  // },
  {
    id: 'e3-10',
    source: '3',
    target: '10',
    type: 'smoothstep',
    sourceHandle: 'BCL_CONVERT-handle-6',
    targetHandle: 'WTS_TUMOR_ONLY-handle-1',
    label: 'use FASTQs as input',
    animated: true,
    markerEnd: 'diamond',
  },
  {
    id: 'e3-11',
    source: '3',
    target: '11',
    type: 'smoothstep',
    sourceHandle: 'BCL_CONVERT-handle-5',
    targetHandle: 'STAR_ALIGNMENT-handle-0',
    label: 'use FASTQs as input',
    animated: true,
    markerEnd: 'diamond',
  },
  {
    id: 'e6-11',
    source: '6',
    target: '11',
    type: 'smoothstep',
    sourceHandle: 'WTS_ALIGNMENT_QC-handle-2',
    targetHandle: 'STAR_ALIGNMENT-handle-1',
    animated: true,
    markerEnd: 'double-arrow',
  },
  // {
  //   id: 'e7-15',
  //   source: '7',
  //   target: '15',
  //   type: 'smoothstep',
  //   sourceHandle: 'WGS_TUMOR_NORMAL-handle-5',
  //   targetHandle: 'GPL-handle-0',
  //   label: 'use T/N as input',
  //   animated: true,
  //   markerEnd: 'diamond',
  // },
  {
    id: 'e7-16',
    source: '7',
    target: '16',
    type: 'smoothstep',
    sourceHandle: 'WGS_TUMOR_NORMAL-handle-4',
    targetHandle: 'ONCOANALYSER_WGS-handle-0',
    animated: true,
    markerEnd: 'arrow',
  },
  {
    id: 'e7-17',
    source: '7',
    target: '17',
    type: 'smoothstep',
    sourceHandle: 'WGS_TUMOR_NORMAL-handle-3',
    targetHandle: 'SASH-handle-1',
    label: 'use T/N as input',
    animated: true,
    markerEnd: 'diamond',
  },
  {
    id: 'e10-9',
    source: '10',
    target: '9',
    type: 'smoothstep',
    sourceHandle: 'WTS_TUMOR_ONLY-handle-2',
    targetHandle: 'RNASUM-handle-1',
    label: 'use expression files as input',
    animated: true,
    markerEnd: 'diamond',
  },
  {
    id: 'e16-18',
    source: '16',
    target: '18',
    type: 'smoothstep',
    sourceHandle: 'ONCOANALYSER_WGS-handle-2',
    targetHandle: 'ONCOANALYSER_WGTS_EXISTING_BOTH-handle-0',
    animated: true,
    markerEnd: 'diamond',
  },
  {
    id: 'e11-14',
    source: '11',
    target: '14',
    type: 'smoothstep',
    sourceHandle: 'STAR_ALIGNMENT-handle-2',
    targetHandle: 'ONCOANALYSER_WTS-handle-0',
    animated: true,
    markerEnd: 'arrow',
  },
  {
    id: 'e14-18',
    source: '14',
    target: '18',
    type: 'smoothstep',
    sourceHandle: 'ONCOANALYSER_WTS-handle-1',
    targetHandle: 'ONCOANALYSER_WGTS_EXISTING_BOTH-handle-1',
    animated: true,
    markerEnd: 'arrow',
  },
  {
    id: 'e16-17',
    source: '16',
    target: '17',
    type: 'buttonedge',
    sourceHandle: 'ONCOANALYSER_WGS-handle-1',
    targetHandle: 'SASH-handle-0',
    animated: true,
    markerEnd: 'arrow',
  },
] satisfies Edge[];
