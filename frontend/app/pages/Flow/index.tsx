import { GitBranch } from "lucide-react";
import LoadingView from "~/components/LoadingView";
import NothingToShow from "~/components/NotingToShow";
import PageHeader from "~/components/PageHeader";
import type { Route } from "../../+types/root";
import FlowCard from "./components/FlowCard";
import { useFlows } from "./hooks/useFlows";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Flows - AI Platform" },
        { name: "description", content: "Manage your AI workflows" },
    ];
}

export default function Flows() {
    const {
        isLoading,
        error,
        flows,
        handleNavigateToNew,
        handleDelete,
        handleNavigateToEdit,
        handleNavigateToTest
    } = useFlows();

    if (isLoading) {
        return <LoadingView label='Loading flows...' />
    }

    return (
        <div className="p-8">
            <PageHeader
                headline='Flows'
                description='Design and manage your AI workflows'
                showBack={false}
                addAction={handleNavigateToNew}
                addActionText='New Flow'
                showAdd={true}
            />
            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {flows.length === 0 ? (
                <NothingToShow
                    headline="No flows yet"
                    description="Get started by creating your first workflow"
                    onClick={handleNavigateToNew}
                    icon={GitBranch}
                    btnText="Create First Flow"
                />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {flows.map((flow) => (
                        <FlowCard key={flow.id} flow={flow} onDelete={handleDelete} onEdit={handleNavigateToEdit} onTest={handleNavigateToTest} />
                    ))}
                </div>
            )}
        </div>
    );
}