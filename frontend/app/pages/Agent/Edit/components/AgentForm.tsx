import { Info, Save } from 'lucide-react';
import DropDown from '~/components/DropDown';
import InputField from '~/components/InputField';
import PrimaryBtn from '~/components/PrimaryBtn';
import SecondaryBtn from '~/components/SecondaryBtn';
import TextArea from '~/components/TextArea';
import { type Api } from '~/pages/Api/common/api-type';
import type { Agent } from '../../common/agent-type';
import AgentApiCard from './AgentApiCard';

interface AgentFormProps {
    initialData: Agent;
    availableApis: Api[];
    onSubmit: () => void;
    onCancel: () => void;
    getModelProviders: () => Map<string, string>;
    getAvailableModels: () => Map<string, string>;
    isLoading?: boolean;
    onDataChange: (updates: Partial<Agent>) => void;
    onProviderChange: (provider: string) => void;
    onToggleApi: (apiId: string) => void;
    isNewAgent: boolean,
    apiSelected: (id: string) => boolean
}

export default function AgentForm({
    initialData,
    availableApis,
    onSubmit,
    onCancel,
    isLoading,
    getModelProviders,
    getAvailableModels,
    onDataChange,
    onProviderChange,
    onToggleApi,
    isNewAgent,
    apiSelected
}: AgentFormProps) {

    return (
        <form className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>

                <InputField
                    label='Agent Name'
                    value={initialData.name}
                    onChange={(value) => onDataChange({ name: value })}
                    required={true}
                    placeholder="E.g., Customer Support Bot."
                />

                <TextArea
                    label='Role Description'
                    value={initialData.description}
                    onChange={(value) => onDataChange({ description: value })}
                    required={true}
                    placeholder='Describe the role of the agent...'
                />

                <DropDown
                    label='Model Provider'
                    value={initialData.model_provider}
                    options={getModelProviders()}
                    onChange={onProviderChange}
                />

                <DropDown
                    label='Model'
                    value={initialData.model_name}
                    options={getAvailableModels()}
                    onChange={(value) => onDataChange({ model_name: value })}
                />

                <InputField
                    label="Temperature"
                    value={initialData.temperature}
                    onChange={(value) => onDataChange({ temperature: value as number })}
                    placeholder="0.7"
                    required={true}
                    type="number"
                    min={0.0}
                    max={1.0}
                    step={0.1}
                />
            </div>

            {/* API Selection */}
            <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Select APIs</h3>

                {availableApis.length === 0 ? (
                    <div className="text-center py-8">
                        <Info size={32} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-600">No APIs available</p>
                        <p className="text-sm text-gray-500 mt-1">Create APIs first to add them to agents</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {availableApis.sort((a, b) => a.tool_description.name.localeCompare(b.tool_description.name)).map((api) => (
                            <AgentApiCard
                                api={api}
                                isSelected={apiSelected(api.id)}
                                onToggleApi={onToggleApi}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-2">
                <SecondaryBtn label='Cancel' onClick={onCancel} disabled={isLoading} />
                <PrimaryBtn
                    label={isLoading ? 'Saving...' : isNewAgent ? 'Update Agent' : 'Create Agent'}
                    onClick={onSubmit}
                    icon={Save}
                    disabled={isLoading || !initialData.name.trim()}
                />
            </div>
        </form>
    );
}