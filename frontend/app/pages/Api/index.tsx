import { Code2 } from "lucide-react";
import LoadingView from "~/components/LoadingView";
import NothingToShow from "~/components/NotingToShow";
import PageHeader from "~/components/PageHeader";
import type { Route } from '../../+types/root';
import ApiCard from "./components/ApiCard";
import { useApiOverview } from "./hooks/useApiOverview";


export function meta({ }: Route.MetaArgs) {
    return [
        { title: "APIs - AI Platform" },
        { name: "description", content: "Manage your API integrations" },
    ];
}

export default function APIOverview() {
    const {
        apis,
        isLoading,
        error,
        handleDelete,
        handleNavigateToNew,
        handleNavigateToEdit,
    } = useApiOverview();

    if (isLoading) {
        return <LoadingView label='Loading APIs...' />
    }

    return (
        <div className="p-8">

            <PageHeader
                headline='Add API'
                description='Manage your API integrations and tools'
                showBack={false}
                addAction={handleNavigateToNew}
                addActionText='Add API'
                showAdd={true}
            />

            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {apis.length === 0 ? (
                <NothingToShow
                    headline="No APIs yet"
                    description="Get started by creating your first API tool"
                    onClick={handleNavigateToNew}
                    icon={Code2}
                    btnText="Create First API"
                />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {apis.sort((a, b) => a.tool_description.name.localeCompare(b.tool_description.name)).map((api) => (
                        <ApiCard key={api.id} api={api} handleNavigateToEdit={handleNavigateToEdit} handleDelete={handleDelete} />
                    ))}
                </div>
            )}
        </div>
    );
}