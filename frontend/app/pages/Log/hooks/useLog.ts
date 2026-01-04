import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { LogService } from '../common/log-service';
import type { ChatLogResponse, FlowLogResponse } from '../common/log-type';

export function useLog() {
    const navigate = useNavigate();
    const [chatLogs, setChatLogs] = useState<ChatLogResponse[]>([]);
    const [flowLogs, setFlowLogs] = useState<FlowLogResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const [chatLogsData, flowLogsData] = await Promise.all([
                LogService.getAllChatLogs(),
                LogService.getAllFlowLogs()
            ]);
            setChatLogs(chatLogsData);
            setFlowLogs(flowLogsData);
        } catch (err) {
            setError('Failed to load log data');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Combine and filter logs
    const combinedLogs = [
        ...chatLogs.map(log => ({ ...log, type: 'chat' as const })),
        ...flowLogs.map(log => ({ ...log, type: 'flow' as const }))
    ];

    // Sort by creation date (most recent first)
    combinedLogs.sort((a, b) => {
        const dateA = new Date('created_at' in a ? a.created_at : a.started);
        const dateB = new Date('created_at' in b ? b.created_at : b.started);
        return dateB.getTime() - dateA.getTime();
    });

    const handleLogClick = (log: typeof combinedLogs[0]) => {
        if (log.type === 'flow') {
            navigate(`/log/flow/${log.flow_execution_id}`);
        } else {
            // Navigate to the testing page with the specific chat ID
            navigate(`/chat?chat=${log.chat_id}`);
        }
    };

    const totalInputTokens = combinedLogs.reduce((sum, log) => {
        if (log.type === 'chat') {
            return sum + log.input_token_count
        } else {
            return sum + log.total_tokens_in
        }
    }, 0);

    const totalOutputTokens = combinedLogs.reduce((sum, log) => {
        if (log.type === 'chat') {
            return sum + log.output_token_count;
        } else {
            return sum + log.total_tokens_out;
        }
    }, 0);

    return {
        isLoading,
        error,

        totalInputTokens,
        totalOutputTokens,

        chatLogs,
        flowLogs,
        combinedLogs,

        handleLogClick,
    };
}