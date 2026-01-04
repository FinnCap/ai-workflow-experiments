import type { Agent } from '~/pages/Agent/common/agent-type';
import type { NodeData } from '~/pages/Flow/common/flow-type';

interface AgentNodePropertiesProps {
    agents: Agent[];
    localData: NodeData,
    onAgentChange: (agentId: string) => void;
}

export default function AgentNodeProperties({ agents, localData, onAgentChange }: AgentNodePropertiesProps) {

    return <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Agent
        </label>
        <select
            value={localData.agentId || ''}
            onChange={(e) => onAgentChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
            <option value="">Select an agent...</option>
            {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                    {agent.name}
                </option>
            ))}
        </select>
    </div>

}