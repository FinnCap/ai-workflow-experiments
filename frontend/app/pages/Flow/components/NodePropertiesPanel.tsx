import type { Node } from '@xyflow/react';
import { X } from 'lucide-react';
import InputField from '~/components/InputField';
import type { NodeData } from '~/pages/Flow/common/flow-type';
import { useNodeProperties } from '../Edit/hooks/useNodeProperties';
import AgentNodeProperties from './properties/AgentNodeProperties';
import DecisionNodeProperties from './properties/DecisionNodeProperties';

interface NodePropertiesPanelProps {
    node: Node<NodeData> | null;
    onClose: () => void;
    onUpdate: (nodeId: string, data: NodeData) => void;
    onUpdateEdgeLabels?: (nodeId: string, decisions: string[]) => void;
}

export default function NodePropertiesPanel({ node, onClose, onUpdate, onUpdateEdgeLabels }: NodePropertiesPanelProps) {

    const {
        agents,
        localData,
        handleLabelChange,
        handleDescriptionChange,
        handleAgentChange,
        addDecisionPath,
        removeDecisionPath,
        updateDecisionPath
    } = useNodeProperties({ node, onClose, onUpdate, onUpdateEdgeLabels })

    if (!node || !localData) return null;

    return (
        <div className="absolute top-0 right-0 w-80 h-full bg-white border-l border-gray-200 shadow-lg z-10 cursor-pointer">
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Node Properties</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto" style={{ height: 'calc(100% - 73px)' }}>
                <InputField label='Label' value={localData.label || ''} onChange={handleLabelChange} required={false} />

                {/* Decision node properties */}
                {node.type === 'decision' && (
                    <DecisionNodeProperties
                        localData={localData}
                        onDescriptionChange={handleDescriptionChange}
                        onAddDecisionPath={addDecisionPath}
                        onRemoveDecisionPath={removeDecisionPath}
                        onUpdateDecisionPath={updateDecisionPath}
                    />
                )}

                {/* Agent nodes - Agent selection */}
                {node.type === 'agent' && (
                    <AgentNodeProperties agents={agents} localData={localData} onAgentChange={handleAgentChange} />
                )}
            </div>
        </div>
    );
}