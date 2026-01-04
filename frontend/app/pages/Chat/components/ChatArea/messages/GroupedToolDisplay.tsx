import { Check, ChevronDown, ChevronUp, Copy, Wrench } from "lucide-react";
import { useState } from "react";
import type { ToolCallContent, ToolResponseContent } from "~/pages/Chat/common/message-type";
import { ToolCallParamters } from "./ToolCallParamters";
import { ToolResponse } from "./ToolResponse";

interface GroupedToolDisplayProps {
    toolCall?: ToolCallContent;
    toolResponse?: ToolResponseContent;
}

export const GroupedToolDisplay = ({ toolCall, toolResponse }: GroupedToolDisplayProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            const data = { toolCall, toolResponse };
            await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const toolCallId = toolCall?.tool_call_id || toolResponse?.tool_call_id;
    const toolName = toolCall?.tool_name || 'Unknown Tool';

    return (
        <div className="flex items-start gap-3 max-w-xl mb-4">
            <div className="bg-orange-400 p-2 rounded-full flex-shrink-0 shadow-sm">
                <Wrench size={16} className="text-white" />
            </div>

            <div className="flex-1 bg-blue-100 border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-4 py-3 bg-orange-400 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Wrench size={16} className="text-white" />
                            <span className="font-medium text-white">
                                {toolName} {toolCallId && `(${toolCallId})`}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={copyToClipboard}
                                className="p-1 text-white hover:text-gray-800 transition-colors cursor-pointer"
                            >
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="p-1 text-white hover:text-gray-800 transition-colors cursor-pointer"
                            >
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                        </div>
                    </div>
                </div>

                {isExpanded && (
                    <div className="px-4 py-3 space-y-4">
                        {toolCall && <ToolCallParamters toolCall={toolCall} />}
                        {toolResponse && <ToolResponse toolResponse={toolResponse} />}
                    </div>
                )}
            </div>
        </div>
    );
};