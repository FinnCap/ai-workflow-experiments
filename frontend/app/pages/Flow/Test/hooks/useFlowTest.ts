import {
    useEdgesState,
    useNodesState,
    useReactFlow,
    type Edge,
    type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { AgentService } from '~/pages/Agent/common/agent-service';
import type { Agent } from '~/pages/Agent/common/agent-type';
import type { PDFContent } from '~/pages/Chat/common/message-type';
import { FlowService } from '~/pages/Flow/common/flow-service';
import type { Flow, NodeData } from '~/pages/Flow/common/flow-type';
import { selectFiles } from '~/utils/handleFileSelect';
import { convertEdgesToReactFlow, convertNodesToReactFlow } from '../../utils/convertTF';


export function useFlowTest() {
    const navigate = useNavigate();
    const { id } = useParams();

    const { fitView } = useReactFlow();

    const [nodes, setNodes] = useNodesState<Node<NodeData>>([]);
    const [edges, setEdges] = useEdgesState<Edge>([]);
    const [flow, setFlow] = useState<Flow | null>(null);
    const [agents, setAgents] = useState<Agent[]>([]);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [inputMessage, setInputMessage] = useState('');
    const [outputMessage, setOutputMessage] = useState('');
    const [showVariables, setShowVariables] = useState(false);
    const [agentVariables, setAgentVariables] = useState<Record<string, Record<string, Record<string, string>>>>({});
    const [agentHeaders, setAgentHeaders] = useState<Record<string, Record<string, Record<string, string>>>>({});
    const [attachedFiles, setAttachedFiles] = useState<PDFContent[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isExecutingFlow, setIsExecutingFlow] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (id) {
            loadFlow();
            loadAgents();
        }
    }, [id]);

    useEffect(() => {
        // Initialize variables when flow and agents are loaded
        if (flow && agents.length > 0) {
            initializeVariables();
        }
    }, [flow, agents]);

    const loadAgents = async () => {
        try {
            const agentsData = await AgentService.getAll();
            setAgents(agentsData);
        } catch (err) {
            console.error('Failed to load agents:', err);
        }
    };

    const loadFlow = async () => {
        try {
            setIsLoading(true);
            const flow = await FlowService.getById(id!);
            setFlow(flow);

            const rfNodes = convertNodesToReactFlow(flow, false)
            const rfEdges = convertEdgesToReactFlow(flow, false)


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

    const initializeVariables = () => {
        if (!flow) return;

        const variablesByAgent: Record<string, Record<string, Record<string, string>>> = {};
        const headersByAgent: Record<string, Record<string, Record<string, string>>> = {};

        // Get unique agent IDs from agent nodes in the flow
        const agentNodes = flow.nodes.filter(node => node.type === 'agent' && node.agent_id);
        const uniqueAgentIds = [...new Set(agentNodes.map(node => node.agent_id!))];

        uniqueAgentIds.forEach(agentId => {
            const agent = agents.find(a => a.id === agentId);
            if (agent) {
                variablesByAgent[agentId] = {};
                headersByAgent[agentId] = {};

                agent.api_models.forEach(api => {
                    if (Object.keys(api.variables).length > 0) {
                        variablesByAgent[agentId][api.id] = {};
                        Object.entries(api.variables).forEach(([key, value]) => {
                            variablesByAgent[agentId][api.id][key] = value || '';
                        });
                    }

                    if (Object.keys(api.headers).length > 0) {
                        headersByAgent[agentId][api.id] = {};
                        Object.entries(api.headers).forEach(([key, value]) => {
                            headersByAgent[agentId][api.id][key] = value || '';
                        });
                    }
                });
            }
        });

        setAgentVariables(variablesByAgent);
        setAgentHeaders(headersByAgent);
    };

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles: PDFContent[] = await selectFiles(event)

        setAttachedFiles(prev => [...prev, ...newFiles]);

        // Clear the input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeAttachedFile = (index: number) => {
        setAttachedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleExecuteFlow = async (e?: React.FormEvent) => {

        e?.preventDefault();

        if (!inputMessage.trim() && attachedFiles.length === 0) {
            setError('Please enter a message or attach a PDF file');
            return;
        }

        try {
            setIsExecutingFlow(true);
            setError(null);
            setOutputMessage('');

            const executeRequest: any = {
                input_str: inputMessage.trim(),
            };

            // Add agent variables and headers if they exist
            if (Object.keys(agentVariables).length > 0) {
                executeRequest.agent_call_variables = agentVariables;
            }
            if (Object.keys(agentHeaders).length > 0) {
                executeRequest.agent_call_headers = agentHeaders;
            }

            // Add PDF data if files are attached
            if (attachedFiles.length > 0) {
                executeRequest.pdf_data = attachedFiles
            }

            const result = await FlowService.execute(id!, executeRequest);
            setOutputMessage(result.flow_response);

            // Clear files after successful execution
            setAttachedFiles([]);
        } catch (err) {
            setError('Failed to execute flow');
            console.error(err);
        } finally {
            setIsExecutingFlow(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleExecuteFlow();
        }
    };

    const handleVariableChange = (agentId: string, apiId: string, key: string, value: string) => {
        setAgentVariables(prev => ({
            ...prev,
            [agentId]: {
                ...prev[agentId],
                [apiId]: {
                    ...prev[agentId]?.[apiId],
                    [key]: value
                }
            }
        }));
    };

    const handleHeaderChange = (agentId: string, apiId: string, key: string, value: string) => {
        setAgentHeaders(prev => ({
            ...prev,
            [agentId]: {
                ...prev[agentId],
                [apiId]: {
                    ...prev[agentId]?.[apiId],
                    [key]: value
                }
            }
        }));
    };

    const getAgentsWithSettings = (): Agent[] => {
        const allAgentIds = new Set([...Object.keys(agentVariables), ...Object.keys(agentHeaders)]);
        return Array.from(allAgentIds).map(agentId => {
            const agent = agents.find(a => a.id === agentId);
            if (!agent) return null;
            const agentCopy = { ...agent };
            agentCopy.api_models = agent?.api_models.filter(api =>
                Object.keys(api.variables).length > 0 || Object.keys(api.headers).length > 0
            ) || []

            return agentCopy

        })
            .filter(agent => agent !== null)
            .filter(agent => agent.api_models.length > 0);
    };

    const navigateBack = () => {
        navigate("/flow")
    }

    return {
        isLoading,
        flow,
        nodes,
        edges,

        showVariables,
        setShowVariables,

        getAgentsWithSettings,

        agentVariables,
        handleVariableChange,

        agentHeaders,
        handleHeaderChange,

        inputRef,
        inputMessage,
        setInputMessage,

        attachedFiles,
        fileInputRef,
        handleFileSelect,
        removeAttachedFile,

        handleKeyPress,

        handleExecuteFlow,
        isExecutingFlow,

        outputMessage,
        error,

        navigateBack
    };
}