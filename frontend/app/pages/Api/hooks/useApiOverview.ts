import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { type Api } from '~/pages/Api/common/api-type';
import { ApiService } from "../common/api-service";

export function useApiOverview() {
    const navigate = useNavigate();
    const [apis, setApis] = useState<Api[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadApis();
    }, []);

    const loadApis = async () => {
        try {
            setIsLoading(true);
            const data = await ApiService.getAll();
            setApis(data);
        } catch (err) {
            setError('Failed to load APIs');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this API?')) return;

        try {
            await ApiService.delete(id);
            await loadApis();
        } catch (err) {
            console.error('Failed to delete API:', err);
        }
    };

    const handleNavigateToNew = () => navigate('/api/new');
    const handleNavigateToEdit = (id: string) => navigate(`/api/${id}/edit`);

    return {
        apis,
        isLoading,
        error,
        handleDelete,
        handleNavigateToNew,
        handleNavigateToEdit,
    };
}