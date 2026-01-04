import { ChevronDown, ChevronRight } from "lucide-react";
import type { FlowLogModelResponse } from "../../common/log-type";
import { NodeTypeBadge } from "../../NodeTypeBadge";
import FlowLogMessage from "./FlowLogMessage";

interface FlowLogNodeProps {
    logIndex: number;
    copiedItems: Set<string>;
    copyToClipboard: (text: string, itemId: string) => Promise<void>;

    node: FlowLogModelResponse;
    toggleNodeExpansion: (nodeId: string) => void
    expandedNodes: Set<string>;
}

export default function FlowLogNode({ logIndex, copiedItems, copyToClipboard, node, toggleNodeExpansion, expandedNodes }: FlowLogNodeProps) {

    const renderMessages = (messages: string[] | string) => {
        if (Array.isArray(messages)) {
            return messages.map((msg, index) => {
                return (
                    <FlowLogMessage index={index} msg={msg} copiedItems={copiedItems} copyToClipboard={copyToClipboard} />
                );
            });
        } else {
            return (
                <FlowLogMessage index={0} msg={messages} copiedItems={copiedItems} copyToClipboard={copyToClipboard} />
            );
        }
    };

    return <div key={node.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div
            className="p-6 cursor-pointer hover:bg-gray-50"
            onClick={() => toggleNodeExpansion(node.id)}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            {logIndex + 1}
                        </span>
                        <button className="text-gray-400 hover:text-gray-600">
                            {expandedNodes.has(node.id) ?
                                <ChevronDown size={20} /> :
                                <ChevronRight size={20} />
                            }
                        </button>
                    </div>
                    <div>
                        <div className="flex items-center space-x-2 mb-1">
                            <div className="font-medium text-gray-900">
                                Node {node.node_id}
                            </div>
                            <NodeTypeBadge nodeType={node.node_type} />
                        </div>
                        <div className="text-sm text-gray-500">
                            {node.total_tokens_in} in tokens • {node.total_tokens_out} out tokens
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-6 text-sm">
                    <div className="text-center">
                        <div className="font-medium">
                            {Array.isArray(node.in_message) ? node.in_message.length : 1}
                        </div>
                        <div className="text-gray-500">inputs</div>
                    </div>
                    <div className="text-center">
                        <div className="font-medium">
                            {Array.isArray(node.out_message) ? node.out_message.length : 1}
                        </div>
                        <div className="text-gray-500">outputs</div>
                    </div>
                </div>
            </div>
        </div>

        {expandedNodes.has(node.id) && (
            <div className="border-t border-gray-200 bg-gray-50 p-6">
                {/* Input/Output Messages */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div>
                        <h4 className="font-medium text-gray-900 mb-3">
                            Input Messages ({Array.isArray(node.in_message) ? node.in_message.length : 1})
                        </h4>
                        {renderMessages(node.in_message)}
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-900 mb-3">
                            Output Messages ({Array.isArray(node.out_message) ? node.out_message.length : 1})
                        </h4>
                        {renderMessages(node.out_message)}
                    </div>
                </div>
            </div>
        )}
    </div>
}