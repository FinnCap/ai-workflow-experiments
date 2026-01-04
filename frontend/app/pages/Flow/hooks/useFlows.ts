import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { FlowService } from '../common/flow-service';
import type { FlowListItem } from '../common/flow-type';

export function useFlows() {
    const navigate = useNavigate();
    const [flows, setFlows] = useState<FlowListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadFlows();
    }, []);

    const loadFlows = async () => {
        try {
            setIsLoading(true);
            const data = await FlowService.getAll();
            setFlows(data);
        } catch (err) {
            setError('Failed to load flows');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this flow?')) return;

        try {
            await FlowService.delete(id);
            await loadFlows();
        } catch (err) {
            console.error('Failed to delete flow:', err);
        }
    };

    const handleNavigateToEdit = (id: string) => {
        navigate(`/flow/${id}/edit`);
    };

    const handleNavigateToNew = () => {
        navigate('/flow/new');
    };

    const handleNavigateToTest = (id: string) => {
        navigate(`/flow/${id}/test`);
    };

    return {
        flows,
        isLoading,
        error,
        handleDelete,
        handleNavigateToEdit,
        handleNavigateToNew,
        handleNavigateToTest
    };
}