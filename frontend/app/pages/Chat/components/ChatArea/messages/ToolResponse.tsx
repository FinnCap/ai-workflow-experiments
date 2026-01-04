import type { ToolResponseContent } from "~/pages/Chat/common/message-type";

interface ToolResponseProps {
    toolResponse: ToolResponseContent;
}

export const ToolResponse = ({ toolResponse }: ToolResponseProps) => {

    return <div className="bg-orange-50 p-3 rounded border border-orange-200">
        <h4 className="text-sm font-medium text-orange-900 mb-2">Tool Response</h4>
        <div className="space-y-2">
            <div>
                <span className="text-sm font-medium text-gray-700">Response:</span>
                <pre className="mt-1 text-sm bg-white p-2 rounded border border-orange-200 overflow-x-auto whitespace-pre-wrap">
                    {typeof toolResponse.response === 'string'
                        ? toolResponse.response
                        : JSON.stringify(toolResponse.response, null, 2)
                    }
                </pre>
            </div>
        </div>
    </div>
};