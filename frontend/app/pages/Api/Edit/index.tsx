import LoadingView from '~/components/LoadingView';
import PageHeader from '~/components/PageHeader';
import ApiForm from '~/pages/Api/Edit/components/ApiForm';
import type { Route } from '../../../+types/root';
import { useApiEdit } from './hooks/useApiEdit';

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Edit API - AI Platform" },
        { name: "description", content: "Create or edit API tool" },
    ];
}

export default function ApiEdit() {
    const {
        id,
        isLoadingData,
        isLoadingSave,
        error,

        initialData,

        handleSubmit,
        handleCancel,
    } = useApiEdit();

    if (isLoadingData) {
        return <LoadingView label='Loading API...' />
    }

    return (
        <div className="p-8 mx-auto">
            <PageHeader
                headline={id ? 'Edit API' : 'Create New API'}
                description='Define the tool interface that will be available in your AI workflows'
                showBack={true}
                backAction={handleCancel}
                backActionText='Back to APIs'
                showAdd={false}
            />

            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            <ApiForm
                initialData={initialData}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isLoading={isLoadingSave}
            />
        </div>
    );
}