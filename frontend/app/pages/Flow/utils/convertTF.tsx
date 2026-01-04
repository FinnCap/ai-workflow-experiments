import {
    type Edge,
    type Node
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { Flow, NodeData } from '~/pages/Flow/common/flow-type';


export const convertNodesToReactFlow = (flow: Flow, editable: boolean) => {
    const rfNodes: Node<NodeData>[] = flow.nodes.map(node => ({
        id: node.react_flow_id,
        type: node.type,
        position: node.position,
        deletable: editable,
        selectable: editable,
        draggable: editable && node.type !== "input" && node.type !== "output",
        data: {
            ...node.data,
            agentId: node.agent_id,
            agentName: node.agent_name,
        },
    }));

    return rfNodes
}

export const convertEdgesToReactFlow = (flow: Flow, editable: boolean) => {
    const rfEdges: Edge[] = flow.edges.map(edge => ({
        id: edge.react_flow_id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.source_handle,
        targetHandle: edge.target_handle,
        label: edge.label,
        deletable: editable,
        selectable: editable,
    }));

    return rfEdges
}
