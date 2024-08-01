import { useCallback, useEffect, FC } from 'react';
import {
  Background,
  Controls,
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Edge,
  Node,
  type OnConnect,
} from '@xyflow/react';

import CustomArrowHeader from './CustomArrowHeader';
// import { overviewNodes as initialNodes, overviewEdges as initialEdges } from './sections';
import getNodesAndEdges from './sections';
import WorkflowNode from './WorkflowNode';
import ButtonEdge from './ButtonEdge';

interface DiagramProps {
  pipelineType: string;
  statusData: Record<string, { status: string; description?: string }>;
}
const WorkflowDiagram: FC<DiagramProps> = ({ pipelineType, statusData }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([] as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);

  useEffect(() => {
    const { nodes, edges } = getNodesAndEdges(pipelineType);
    setNodes(
      nodes.map((node) => {
        if (statusData[node.data.type]?.status) {
          return {
            ...node,
            data: {
              ...node.data,
              detail: {
                status: statusData[node.data.type]?.status,
                description: statusData[node.data.type]?.description,
              },
            },
          };
        } else {
          return node;
        }
      })
    );

    setEdges(edges);
  }, [setNodes, setEdges, pipelineType, statusData]);

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges]
  );
  const nodeTypes = {
    workflow: WorkflowNode,
  };
  const edgeTypes = {
    buttonedge: ButtonEdge,
  };

  return (
    <>
      <CustomArrowHeader />
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        edges={edges}
        edgeTypes={edgeTypes}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        {/* <MiniMap /> */}
        <Controls />
      </ReactFlow>
    </>
  );
};

export default WorkflowDiagram;
