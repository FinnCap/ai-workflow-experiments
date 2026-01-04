import type { Node } from '@xyflow/react';
import { useEffect, useState } from 'react';
import { AgentService } from '~/pages/Agent/common/agent-service';
import type { Agent } from '~/pages/Agent/common/agent-type';
import type { NodeData } from '~/pages/Flow/common/flow-type';

interface UseNodePropertiesProps {
    node: Node<NodeData> | null;
    onClose: () => void;
    onUpdate: (nodeId: string, data: NodeData) => void;
    onUpdateEdgeLabels?: (nodeId: string, decisions: string[]) => void;
}


export function useNodeProperties({ node, onClose, onUpdate, onUpdateEdgeLabels }: UseNodePropertiesProps) {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [localData, setLocalData] = useState<NodeData>(node!.data);

    useEffect(() => {
        if (node?.type === 'agent') {
            loadAgents();
        }
    }, [node?.type]);

    useEffect(() => {
        if (node) {
            let data = { ...node.data };

            // Initialize decision paths if it's a decision node and doesn't have any
            if (node.type === 'decision' && !data.decisions) {
                data.decisions = ['Yes', 'No']; // Default paths
                onUpdate(node.id, data);
            }

            setLocalData(data);
        }
    }, [node?.id, node?.data]);

    // Separate handlers for different field types
    const handleLabelChange = (label: string) => {
        if (node) {
            const updatedData = {
                ...localData,
                label
            };
            setLocalData(updatedData);
            onUpdate(node.id, updatedData);
        }
    };

    const handleDescriptionChange = (description: string) => {
        if (node) {
            const updatedData = {
                ...localData,
                description
            };
            setLocalData(updatedData);
            onUpdate(node.id, updatedData);
        }
    };

    const handleAgentChange = (agentId: string) => {
        if (node) {
            const agent = agents.find(a => a.id === agentId);
            const updatedData = {
                ...localData,
                agentId,
                agentName: agent?.name
            };
            setLocalData(updatedData);
            onUpdate(node.id, updatedData);
        }
    };

    const loadAgents = async () => {
        try {
            const data = await AgentService.getAll();
            setAgents(data);
        } catch (err) {
            console.error('Failed to load agents:', err);
        }
    };

    const addDecisionPath = () => {
        if (node && localData) {
            const currentDecisions = localData.decisions || [];
            const updatedData = {
                ...localData,
                decisions: [...currentDecisions, `Option ${currentDecisions.length + 1}`]
            };
            setLocalData(updatedData);
            onUpdate(node.id, updatedData);
        }
    };

    const removeDecisionPath = (index: number) => {
        if (node && localData && localData.decisions && localData.decisions.length > 1) {
            const newPaths = (localData.decisions as Array<string>).filter((_, i) => i !== index);
            const updatedData = {
                ...localData,
                decisions: newPaths
            };
            setLocalData(updatedData);
            onUpdate(node.id, updatedData);
        }
    };

    const updateDecisionPath = (index: number, value: string) => {
        if (node && localData && localData.decisions) {
            const newPaths = [...localData.decisions];
            newPaths[index] = value;
            const updatedData = {
                ...localData,
                decisions: newPaths
            };
            setLocalData(updatedData);
            onUpdate(node.id, updatedData);

            // Update edge labels for this node
            if (onUpdateEdgeLabels) {
                onUpdateEdgeLabels(node.id, newPaths);
            }
        }
    };

    return {
        agents,
        localData,
        handleLabelChange,
        handleDescriptionChange,
        handleAgentChange,
        addDecisionPath,
        removeDecisionPath,
        updateDecisionPath
    };
}