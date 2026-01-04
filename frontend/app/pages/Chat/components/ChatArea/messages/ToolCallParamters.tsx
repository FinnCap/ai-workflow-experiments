import type { ToolCallContent } from "~/pages/Chat/common/message-type";

interface ToolCallParamtersProps {
    toolCall: ToolCallContent;
}

export const ToolCallParamters = ({ toolCall }: ToolCallParamtersProps) => {
    return <div className="bg-blue-50 p-3 rounded border border-blue-200">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Tool Call</h4>
        <div className="space-y-2">
            <div>
                <span className="text-sm font-medium text-gray-700">Parameters:</span>
                <pre className="mt-1 text-sm bg-white p-2 rounded border border-blue-200 overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(toolCall.parameters, null, 2)}
                </pre>
            </div>
        </div>
    </div>

};