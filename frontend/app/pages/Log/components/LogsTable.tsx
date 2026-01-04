import { Bot, GitBranch, MessageSquare } from "lucide-react";
import { formatDate, formatDuration, formatRelativeTime } from "../../../utils/formatDates";
import type { ChatLogResponse, FlowLogResponse } from "../common/log-type";

interface LogsTableProps {
    combinedLogs: (ChatLogResponse | FlowLogResponse)[];
    handleLogClick: (log: ChatLogResponse | FlowLogResponse) => void;
}

export default function LogsTable({
    combinedLogs,
    handleLogClick,
}: LogsTableProps) {

    return <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID / Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tokens
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Time/Count
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Agent/Flow
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {combinedLogs.map((log) => (
                        <tr
                            key={log.type === 'chat' ? log.chat_id : log.flow_execution_id}
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleLogClick(log)}
                        >
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${log.type === 'chat'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-blue-100 text-blue-700'
                                    }`}>
                                    {log.type === 'chat' ? <MessageSquare size={12} className="mr-1" /> : <GitBranch size={12} className="mr-1" />}
                                    {log.type === 'chat' ? 'Chat' : 'Flow'}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                    {log.type === 'chat' ? (
                                        <>
                                            <div className="font-mono text-xs text-gray-500">{log.chat_id}</div>
                                            <div>{log.title || 'Untitled Chat'}</div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="font-mono text-xs text-gray-500">{log.flow_execution_id}</div>
                                            <div>Flow Execution</div>
                                        </>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                    {log.type === 'chat'
                                        ? (log.input_token_count + log.output_token_count).toLocaleString()
                                        : (log.total_tokens_in + log.total_tokens_out).toLocaleString()
                                    }
                                </div>
                                <div className="text-xs text-gray-500">
                                    {log.type === 'chat'
                                        ? `${log.input_token_count.toLocaleString()} in, ${log.output_token_count.toLocaleString()} out`
                                        : `${log.total_tokens_in.toLocaleString()} in, ${log.total_tokens_out.toLocaleString()} out`
                                    }
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                    {log.type === 'chat'
                                        ? `${log.message_count} messages`
                                        : formatDuration(log.started, log.stopped)
                                    }
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                    {log.type === 'chat' ? (
                                        <div className="flex items-center">
                                            <Bot size={14} className="mr-1 text-gray-500" />
                                            {log.agent.name}
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            <GitBranch size={14} className="mr-1 text-gray-500" />
                                            {log.flow_id}
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                    {formatRelativeTime(log.type === 'chat' ? log.created_at : log.started)}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {formatDate(log.type === 'chat' ? log.created_at : log.started)}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>

}