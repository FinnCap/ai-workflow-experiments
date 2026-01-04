import { GitBranch, MessageSquare, Zap } from "lucide-react";
import LoadingView from "~/components/LoadingView";
import PageHeader from "~/components/PageHeader";
import LogsTable from "./components/LogsTable";
import StatisticCard from "./components/StatisticCard";
import { useLog } from "./hooks/useLog";

export function meta() {
    return [
        { title: "Logs - AI Platform" },
        { name: "description", content: "View chat and flow logs" },
    ];
}

export default function Logs() {

    const {
        isLoading,
        error,

        totalInputTokens,
        totalOutputTokens,

        chatLogs,
        flowLogs,
        combinedLogs,

        handleLogClick,
    } = useLog();

    if (isLoading) {
        return <LoadingView label="Loading logs..." />
    }

    return (
        <div className="p-8">
            <PageHeader headline="System Logs" description={"Monitor chat conversations and flow executions"} showBack={false} showAdd={false} />

            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatisticCard name={"Input Tokens"} description={totalInputTokens.toLocaleString()} icon={Zap} iconColor={"text-blue-600"} iconBgColor={"bg-blue-100"} />
                <StatisticCard name={"Ouput Tokens"} description={totalOutputTokens.toLocaleString()} icon={Zap} iconColor={"text-green-600"} iconBgColor={"bg-green-100"} />
                <StatisticCard name={"Chat Sessions"} description={chatLogs.length.toString()} icon={MessageSquare} iconColor={"text-purple-600"} iconBgColor={"bg-purple-100"} />
                <StatisticCard name={"Flow Executions"} description={flowLogs.length.toString()} icon={GitBranch} iconColor={"text-orange-600"} iconBgColor={"bg-orange-100"} />
            </div>

            <LogsTable combinedLogs={combinedLogs} handleLogClick={handleLogClick} />

        </div>
    );
}