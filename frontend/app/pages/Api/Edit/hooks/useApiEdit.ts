import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { type Api, type UpdateApiRequest } from '~/pages/Api/common/api-type';
import { ApiService } from '../../common/api-service';

export function useApiEdit() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [initialData, setInitialData] = useState<Api | undefined>();
    const [isLoadingSave, setIsLoadingSave] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(!!id);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            loadApi();
        }
    }, [id]);

    const loadApi = async () => {
        try {
            setIsLoadingData(true);
            const api = await ApiService.getById(id!);
            setInitialData(api);
        } catch (err) {
            setError('Failed to load API');
            console.error(err);
        } finally {
            setIsLoadingData(false);
        }
    };

    const handleSubmit = async (data: UpdateApiRequest) => {
        try {
            setIsLoadingSave(true);
            setError(null);

            if (id) {
                await ApiService.update(id, {
                    tool_description: data.tool_description,
                    method: data.method,
                    url: data.url,
                    variables: data.variables,
                    headers: data.headers,
                    response_hidden_fields: data.response_hidden_fields,
                    path_variables: data.path_variables,
                    active: data.active
                });
            } else {
                await ApiService.create({
                    tool_description: data.tool_description,
                    method: data.method,
                    url: data.url,
                    variables: data.variables,
                    headers: data.headers,
                    response_hidden_fields: data.response_hidden_fields,
                    path_variables: data.path_variables,
                    active: data.active
                });
            }

            navigate('/api');
        } catch (err) {
            setError(id ? 'Failed to update API' : 'Failed to create API');
            console.error(err);
        } finally {
            setIsLoadingSave(false);
        }
    };

    const handleCancel = () => {
        navigate('/api');
    };


    return {
        id,
        isLoadingData,
        isLoadingSave,
        error,

        initialData,

        handleSubmit,
        handleCancel,
    };
}