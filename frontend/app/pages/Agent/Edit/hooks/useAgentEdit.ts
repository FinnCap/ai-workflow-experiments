import { randomUUID } from 'crypto';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ApiService } from '~/pages/Api/common/api-service';
import type { Api } from '~/pages/Api/common/api-type';
import { AgentService } from '../../common/agent-service';
import type { Agent } from '../../common/agent-type';

const MODEL_PROVIDERS = [
    {
        id: 'anthropic',
        name: 'Anthropic',
        models: [
            { id: 'claude-haiku-4-5-20251001', name: 'Claude 4.5 Haiku' },
            { id: 'claude-sonnet-4-20250514', name: 'Claude 4 Sonnet' },
            { id: 'claude-sonnet-4-5-20250929', name: 'Claude 4.5 Sonnet' },
        ]
    },
    {
        id: 'mistral',
        name: 'Mistral',
        models: [
            { id: "mistral-medium-2508", name: 'Mistral Medium 3.1' },
            { id: "devstral-medium-2507", name: 'Devstral Medium' },
        ]
    }
];


export function useAgentEdit() {

    const navigate = useNavigate();
    const { id } = useParams();
    const [agentData, setAgentData] = useState<Agent>({
        id: randomUUID().toString(),
        name: "",
        description: "",
        temperature: 0.7,
        api_models: [],
        model_name: MODEL_PROVIDERS[0].id,
        model_provider: MODEL_PROVIDERS[0].models[0].id
    });
    const [apis, setApis] = useState<Api[]>([]);
    const [isLoadingSave, setIsLoadingSave] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isNewAgent, setIsNewAgent] = useState<boolean>(true);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            setIsLoadingData(true);

            // Always load available APIs
            const apisData = await ApiService.getAll();
            setApis(apisData);

            // Load agent data if editing
            if (id) {
                const agent = await AgentService.getById(id);
                setIsNewAgent(true)
                setAgentData({
                    id: agent.id,
                    name: agent.name,
                    description: agent.description,
                    temperature: agent.temperature,
                    api_models: agent.api_models || [],
                    model_name: agent.model_name,
                    model_provider: agent.model_provider,
                    created_at: agent.created_at,
                    updated_at: agent.updated_at
                });
            }
        } catch (err) {
            setError('Failed to load data');
            console.error(err);
        } finally {
            setIsLoadingData(false);
        }
    };

    const handleSubmit = async () => {
        try {
            setIsLoadingSave(true);
            setError(null);

            const requestData = {
                id: id,
                name: agentData.name,
                description: agentData.description,
                temperature: agentData.temperature,
                api_ids: agentData.api_models.map(api => api.id).filter((id): id is string => id !== undefined),
                model_provider: agentData.model_provider,
                model_name: agentData.model_name
            };

            if (id) {
                await AgentService.update(id, requestData);
            } else {
                await AgentService.create(requestData);
            }

            navigate('/agent');
        } catch (err) {
            setError(id ? 'Failed to update agent' : 'Failed to create agent');
            console.error(err);
        } finally {
            setIsLoadingSave(false);
        }
    };

    const handleCancel = () => {
        navigate('/agent');
    };

    const selectedProvider = MODEL_PROVIDERS.find(p => p.id === agentData.model_provider);
    const availableModels = selectedProvider?.models || [];

    const toggleApi = (apiId: string) => {

        const toggledApi = apis.find((api) => api.id === apiId);
        if (toggledApi === undefined) {
            return
        }

        const shouldRemove = agentData.api_models.some(model => model.id === apiId)
        const updatedApis = shouldRemove ? agentData.api_models.filter(model => model.id !== apiId) : [...agentData.api_models, toggledApi]

        setAgentData({
            ...agentData,
            api_models: updatedApis
        });
    };

    const updateAgentData = (updates: Partial<Agent>) => {
        setAgentData(prev => ({ ...prev, ...updates }));
    };

    const handleProviderChange = (newProvider: string) => {
        const provider = MODEL_PROVIDERS.find(p => p.id === newProvider);
        if (provider === undefined) {
            return
        }
        const firstModelId = provider?.models[0]?.id || '';
        if (firstModelId === undefined) {
            return
        }

        // Update both provider and model in a single setState call
        setAgentData({
            ...agentData,
            model_provider: newProvider,
            model_name: firstModelId
        });
    }

    const getModelProviders = (): Map<string, string> => {
        return new Map(
            MODEL_PROVIDERS.map((provider) => [provider.id, provider.name])
        );
    };

    const getAvailableModels = (): Map<string, string> => {
        return new Map(
            availableModels.map((provider) => [provider.id, provider.name])
        );
    };

    const apiSelected = (id: string): boolean => {
        return agentData.api_models.some(m => m.id === id)
    }

    return {
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
    };
}