import type { Agent } from "~/pages/Agent/common/agent-type";
import ApiSettingsHeader from "~/pages/Chat/components/ChatArea/apiSettings/ApiSettingsHeader";

interface FlowApiTestSettingsProps {
    agentsWithSettings: Agent[];
    agentVariables: Record<string, Record<string, Record<string, string>>>;
    handleVariableChange: (agentId: string, apiId: string, key: string, value: string) => void;

    agentHeaders: Record<string, Record<string, Record<string, string>>>;
    handleHeaderChange: (agentId: string, apiId: string, key: string, value: string) => void;
}

export default function FlowApiTestSettings({
    agentsWithSettings,

    agentVariables,
    handleVariableChange,

    agentHeaders,
    handleHeaderChange,
}: FlowApiTestSettingsProps) {

    return <div className="border-b border-gray-200 bg-gray-50 flex-shrink-0">
        <div className="p-4 max-h-64 overflow-y-auto">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Flow Settings</h4>
            <div className="space-y-4">
                {agentsWithSettings.map((agent) => (
                    <div key={agent.id} className="space-y-3">
                        <h5 className="text-xs font-semibold text-gray-600 uppercase tracking-wide border-b border-gray-200 pb-1">
                            {agent.name}
                        </h5>
                        <div className="space-y-3 ml-2">
                            <ApiSettingsHeader
                                apisWithSettings={agent.api_models}
                                apiVariables={agentVariables[agent.id]}
                                handleVariableChange={(apiId: string, key: string, value: string) => { handleVariableChange(agent.id, apiId, key, value) }}
                                apiHeaders={agentHeaders[agent.id]}
                                handleHeaderChange={(apiId: string, key: string, value: string) => { handleHeaderChange(agent.id, apiId, key, value) }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
}