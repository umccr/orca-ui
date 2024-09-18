import { nodes as overviewNodes, edges as overviewEdges } from './overviewDigram';
import { nodes as wtsNodes, edges as wtsEdges } from './wtsDiagram';
import { nodes as wgsNodes, edges as wgsEdges } from './wgsDiagram';
import { nodes as ctdnaNodes, edges as ctdnaEdges } from './ctdnaDiagram';
import { nodes as ctsoNodes, edges as ctsoEdges } from './cttsoDiagram';
import { nodes as workflowNodes, edges as workflowEdges } from './workflowOverview';

// function to get the nodes and edges for the diagram form pipeline type
const getNodesAndEdges = (pipelineType: string) => {
  switch (pipelineType) {
    case 'overview':
      return { nodes: overviewNodes, edges: overviewEdges };
    case 'workflows':
      return { nodes: workflowNodes, edges: workflowEdges };
    case 'wts':
      return { nodes: wtsNodes, edges: wtsEdges };
    case 'wgs':
      return { nodes: wgsNodes, edges: wgsEdges };
    case 'ctDNA':
      return { nodes: ctdnaNodes, edges: ctdnaEdges };
    case 'ctTSO':
      return { nodes: ctsoNodes, edges: ctsoEdges };

    default:
      return { nodes: overviewNodes, edges: overviewEdges };
  }
};
export default getNodesAndEdges;
