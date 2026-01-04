import { Zap } from 'lucide-react';
import LoadingView from '~/components/LoadingView';
import PageHeader from '~/components/PageHeader';
import PrimaryBtn from '~/components/PrimaryBtn';
import { formatDate } from '~/utils/formatDates';
import StatisticCard from '../components/StatisticCard';
import FlowLogNode from './components/FlowLogNode';
import { useLogFlow } from './hooks/useLogFlow';

export function meta() {
    return [
        { title: "Flow Log Details - AI Platform" },
        { name: "description", content: "View detailed flow execution logs" },
    ];
}

export default function FlowLogDetail() {

    const {
        isLoading,
        error,

        flowDetail,
        copiedItems,

        copyToClipboard,

        toggleNodeExpansion,
        expandedNodes,

        navigateBack
    } = useLogFlow();


    if (isLoading) {
        return <LoadingView label="Loading flow details..." />
    }

    if (error || !flowDetail) {
        return (
            <div className="p-8">
                <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Flow log not found</h3>
                    <p className="text-gray-600 mb-4">{error || 'The requested flow log could not be found'}</p>
                    <div className="flex justify-center">
                        <PrimaryBtn label={'Back to Logs'} onClick={navigateBack} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <PageHeader
                headline={"Flow Execution"}
                description={`Executed from ${formatDate(flowDetail.started)} to ${formatDate(flowDetail.stopped)} - ID: ${flowDetail.flow_id}`}
                showBack={true}
                showAdd={false}
                backActionText="Back to Logs"
                backAction={navigateBack}
            />

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatisticCard name={"Input Tokens"} description={flowDetail.total_tokens_in.toLocaleString()} icon={Zap} iconColor={"text-blue-600"} iconBgColor={"bg-blue-100"} />
                <StatisticCard name={"Ouput Tokens"} description={flowDetail.total_tokens_out.toLocaleString()} icon={Zap} iconColor={"text-green-600"} iconBgColor={"bg-green-100"} />
                <StatisticCard name={"Node Count"} description={flowDetail.logs.length.toString()} icon={Zap} iconColor={"text-orange-600"} iconBgColor={"bg-orange-100"} />
            </div>

            {/* Flow Nodes */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Flow Execution Nodes
                </h3>

                {
                    flowDetail.logs.map((node, index) => (
                        <FlowLogNode
                            logIndex={index}
                            copiedItems={copiedItems}
                            copyToClipboard={copyToClipboard}
                            node={node}
                            toggleNodeExpansion={toggleNodeExpansion}
                            expandedNodes={expandedNodes}
                        />
                    ))
                }
            </div>
        </div>
    );
}