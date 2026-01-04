// app/routes/flow-edit.tsx
import {
    addEdge,
    useEdgesState,
    useNodesState,
    useReactFlow,
    type Connection,
    type Edge,
    type Node
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useEffect, useState, type DragEvent } from 'react';
import { useNavigate, useParams } from 'react-router';
import { FlowService } from '~/pages/Flow/common/flow-service';
import type { CreateFlowRequest, NodeData, UpdateFlowRequest } from '~/pages/Flow/common/flow-type';
import { convertEdgesToReactFlow, convertNodesToReactFlow } from '../../utils/convertTF';


export function useFlowEdit() {
    const navigate = useNavigate();
    const { id } = useParams();

    const { screenToFlowPosition, getNodes, fitView } = useReactFlow();

    const [nodes, setNodes, onNodesChange] = useNodesState<Node<NodeData>>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const [flowName, setFlowName] = useState('');
    const [flowDescription, setFlowDescription] = useState('');
    const [selectedNode, setSelectedNode] = useState<Node<NodeData> | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {

        if (id) {
            loadFlow();
        } else {
            // Initialize with default nodes for new flow
            setNodes([
                {
                    id: '1',
                    type: 'input',
                    position: { x: 100, y: 200 },
                    deletable: false,
                    data: { label: 'Start', ioType: 'text' },
                },
                {
                    id: '2',
                    type: 'output',
                    position: { x: 500, y: 200 },
                    deletable: false,
                    data: { label: 'End', ioType: 'text' },
                },
            ]);
        }
    }, [id, setNodes]);

    const loadFlow = async () => {
        try {
            setIsLoading(true);
            const flow = await FlowService.getById(id!);
            setFlowName(flow.name);
            setFlowDescription(flow.description || '');

            const rfNodes = convertNodesToReactFlow(flow, true)

            const rfEdges = convertEdgesToReactFlow(flow, true)

            setNodes(rfNodes);
            setEdges(rfEdges);

            fitView({ padding: 0.2, maxZoom: 1 });
        } catch (err) {
            setError('Failed to load flow');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const getEdgeLabel = (sourceNode: Node<NodeData>, sourceHandle: string | null): string | undefined => {
        // If source is a decision node, find the corresponding decision path
        if (sourceNode.type === 'decision' && sourceHandle) {
            const handleIndex = parseInt(sourceHandle.split('-')[1]);
            const decisionPaths = sourceNode.data.decisionPaths || ['Yes', 'No'];
            return decisionPaths[handleIndex] || '';
        }
        return undefined;
    };

    const onConnect = useCallback(
        (params: Connection) => {
            const nodes = getNodes() as Node<NodeData>[];
            const sourceNode = nodes.find(node => node.id === params.source);
            const edgeLabel = sourceNode ? getEdgeLabel(sourceNode, params.sourceHandle) : undefined;

            // Explicitly create a new Edge object to ensure type safety.
            const newEdge: Edge = {
                id: `edge-${Date.now()}`,
                source: params.source!,
                target: params.target!,
                sourceHandle: params.sourceHandle!,
                targetHandle: params.targetHandle!,
                label: edgeLabel
            };

            setEdges((eds) => addEdge(newEdge, eds));
        },
        [setEdges]
    );

    const onDragOver = useCallback((event: DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');
            if (!type) return;

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const newNode: Node<NodeData> = {
                id: `node-${Date.now()}`,
                type,
                position,
                deletable: true,
                data: {
                    label: `${type.charAt(0).toUpperCase() + type.slice(1)} node`,
                    ...(type === 'input' || type === 'output' ? { ioType: 'text' } : {}),
                    ...(type === 'decision' ? { decisions: ['Yes', 'No'] } : {}) // Add this
                },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [screenToFlowPosition, setNodes]
    );

    const onNodeClick = useCallback((event: React.MouseEvent, node: Node<NodeData>) => {
        setSelectedNode(node);
    }, []);

    const handleNodeUpdate = (nodeId: string, data: NodeData) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === nodeId) {
                    return { ...node, data };
                }
                return node;
            })
        );
    };

    const updateEdgeLabels = useCallback((nodeId: string, newDecisions: string[]) => {
        setEdges((currentEdges) =>
            currentEdges.map((edge) => {
                if (edge.source === nodeId && edge.sourceHandle?.startsWith('output-')) {
                    const handleIndex = parseInt(edge.sourceHandle.split('-')[1]);
                    // Update the label to match the new decision path name
                    if (handleIndex < newDecisions.length) {
                        return {
                            ...edge,
                            label: newDecisions[handleIndex]
                        };
                    }
                }
                return edge;
            })
        );
    }, [setEdges]);

    const handleSave = async () => {
        if (!flowName) {
            setError('Please enter a flow name');
            return;
        }

        try {
            setIsSaving(true);
            setError(null);

            // Prepare nodes data
            const preparedNodes = nodes.map(node => ({
                react_flow_id: node.id,
                type: node.type!,
                position: node.position,
                data: node.data,
                agent_id: node.data.agentId,
            }));

            // Prepare edges data
            const preparedEdges = edges.map(edge => ({
                react_flow_id: edge.id,
                source: edge.source,
                target: edge.target,
                label: edge.label?.toLocaleString(),
                source_handle: edge.sourceHandle,
                target_handle: edge.targetHandle,
            }));

            if (id) {
                // Update existing flow
                const updateData: UpdateFlowRequest = {
                    name: flowName,
                    description: flowDescription || undefined,
                    nodes: preparedNodes,
                    edges: preparedEdges,
                };
                await FlowService.update(id, updateData);
            } else {
                // Create new flow
                const createData: CreateFlowRequest = {
                    name: flowName,
                    description: flowDescription || undefined,
                    nodes: preparedNodes,
                    edges: preparedEdges,
                };
                await FlowService.create(createData);
            }

            navigate('/flow');
        } catch (err) {
            setError(id ? 'Failed to update flow' : 'Failed to create flow');
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleNavigateBack = () => {
        navigate('/flow')
    }

    return {
        isLoading,
        error,

        flowDescription,
        setFlowDescription,
        flowName,
        setFlowName,

        handleSave,
        isSaving,

        nodes,
        onNodesChange,
        edges,
        onEdgesChange,
        onConnect,
        onNodeClick,
        onDrop,
        onDragOver,

        selectedNode,
        setSelectedNode,
        handleNodeUpdate,
        updateEdgeLabels,

        handleNavigateBack
    };
}