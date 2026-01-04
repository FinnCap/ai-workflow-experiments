import LoadingView from '~/components/LoadingView';
import PageHeader from '~/components/PageHeader';
import type { Route } from '../../../+types/root';
import AgentForm from './components/AgentForm';
import { useAgentEdit } from './hooks/useAgentEdit';

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Edit Agent - AI Platform" },
        { name: "description", content: "Create or edit agent" },
    ];
}

export default function AgentEdit() {
    const {
        id,
        apis,
        agentData,
        isNewAgent,
        isLoadingSave,
        isLoadingData,
        error,
        getModelProviders,
        getAvailableModels,
        handleSubmit,
        handleCancel,

        toggleApi,
        handleProviderChange,
        updateAgentData,
        apiSelected
    } = useAgentEdit();

    if (isLoadingData) {
        return <LoadingView label='Loading Agent Definition...' />
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <PageHeader
                headline={id ? 'Edit Agent' : 'Create New Agent'}
                description='Organize your APIs into agents for better workflow management'
                showBack={true}
                backAction={handleCancel}
                backActionText='Back to Agents'
                showAdd={false}
            />

            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            <AgentForm
                initialData={agentData}
                availableApis={apis}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isLoading={isLoadingSave}
                getModelProviders={getModelProviders}
                getAvailableModels={getAvailableModels}
                onDataChange={updateAgentData}
                onProviderChange={handleProviderChange}
                onToggleApi={toggleApi}
                isNewAgent={isNewAgent}
                apiSelected={apiSelected}
            />
        </div>
    );
}