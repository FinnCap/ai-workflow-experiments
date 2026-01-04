import { FolderOpen } from "lucide-react";
import LoadingView from "~/components/LoadingView";
import NothingToShow from "~/components/NotingToShow";
import PageHeader from "~/components/PageHeader";
import type { Route } from '../../+types/root';
import AgentCard from './components/AgentCard';
import { useAgentOverview } from "./hooks/useAgentOverview";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Agents - AI Platform" },
        { name: "description", content: "Manage your AI agents" },
    ];
}

export default function Agents() {
    const {
        agents,
        isLoading,
        error,
        handleDelete,
        handleNavigateToEdit,
        handleNavigateToNew } = useAgentOverview();

    if (isLoading) {
        return <LoadingView label='Loading agents...' />
    }

    return (
        <div className="p-8">
            <PageHeader
                headline='Agents'
                description='Create your agents to be used in the chat or in a flow'
                showBack={false}
                addAction={handleNavigateToNew}
                addActionText='New Agent'
                showAdd={true}
            />

            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {agents.length === 0 ? (
                <NothingToShow
                    headline="No agents yet"
                    description="Create your first agent to start organizing your AI workflows"
                    onClick={handleNavigateToNew}
                    icon={FolderOpen}
                    btnText="Create First Agent"
                />
            ) : (
                <div className="space-y-4">
                    {agents.sort((a, b) => a.name.localeCompare(b.name)).map((agent) => (
                        <AgentCard
                            key={agent.id}
                            agent={agent}
                            onEdit={handleNavigateToEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}