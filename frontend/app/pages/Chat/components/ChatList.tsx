// app/components/chat-list.tsx
import { Bot, Clock, Trash2 } from 'lucide-react';
import type { Agent } from '~/pages/Agent/common/agent-type';
import { type Chat } from '~/pages/Chat/common/chat-type';
import { formatRelativeTime } from '~/utils/formatDates';

interface ChatListProps {
    chats: Chat[];
    agents: Agent[];
    selectedChatId?: string;
    onSelectChat: (chatId: string) => void;
    onDeleteChat: (chatId: string) => void;
}

export const ChatList = ({
    chats,
    agents,
    selectedChatId,
    onSelectChat,
    onDeleteChat
}: ChatListProps) => {

    const getAgentName = (agentId?: string) => {
        if (!agentId) return 'No Agent';
        const agent = agents.find(a => a.id === agentId);
        return agent?.name || 'Unknown Agent';
    };

    const getSelectedColor = (id: string): string => {
        return selectedChatId === id
            ? 'border-gray-400 bg-gray-50 shadow-sm'
            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50';
    }

    return (
        <div className="space-y-2">
            {chats.map((chat) => (
                <div
                    key={chat.id}
                    className={`group p-3 rounded-lg border cursor-pointer transition-all ${getSelectedColor(chat.id)}`}
                    onClick={() => onSelectChat(chat.id)}
                >
                    <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 truncate mb-1">
                                {chat.title || 'Untitled Chat'}
                            </div>

                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <Bot size={12} />
                                <span className="truncate">{getAgentName(chat.agent_id)}</span>
                                <span>•</span>
                                <span>{chat.message_count} msgs</span>
                            </div>

                            <div className="flex items-center space-x-1 text-xs text-gray-400 mt-1">
                                <Clock size={10} />
                                <span>{formatRelativeTime(chat.updated_at)}</span>
                            </div>
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteChat(chat.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition-all cursor-pointer"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};