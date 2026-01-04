import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { AgentService } from '../common/agent-service';
import type { Agent } from '../common/agent-type';

export function useAgentOverview() {
    const navigate = useNavigate();
    const [agents, setAgents] = useState<Agent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const agentsData = await AgentService.getAll();
            setAgents(agentsData);
        } catch (err) {
            setError('Failed to load data');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this agent?')) return;

        try {
            await AgentService.delete(id);
            await loadData();
        } catch (err) {
            console.error('Failed to delete agent:', err);
        }
    };

    const handleNavigateToEdit = (id: string) => {
        navigate(`/agent/${id}/edit`);
    };

    const handleNavigateToNew = () => {
        navigate('/agent/new');
    };

    return {
        agents,
        isLoading,
        error,
        handleDelete,
        handleNavigateToEdit,
        handleNavigateToNew,
    };
}