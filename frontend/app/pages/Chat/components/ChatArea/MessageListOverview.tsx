import { Loader2, MessageSquare } from "lucide-react";
import type { Message } from "../../common/message-type";
import { MessageList } from "../MessageList";


interface MessageListOverviewProps {
    messages: Message[];
    hasSettings: boolean | null | undefined;
    isSending: boolean;
    messagesEndRef: React.RefObject<HTMLDivElement | null>
}

export default function MessageListOverview({ messages, hasSettings, isSending, messagesEndRef }: MessageListOverviewProps) {
    return <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {messages.length === 0 ? (
            <div className="text-center py-12">
                <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Start the conversation</h3>
                <p className="text-gray-600">Send a message to begin testing your agent</p>
                {hasSettings && (
                    <p className="text-gray-600">
                        Configure API settings using the Settings button above
                    </p>
                )}
            </div>
        ) : (
            <>
                <MessageList messages={messages} />
                {isSending && (
                    <div className="flex justify-start mb-4">
                        <div className="flex items-start space-x-3">
                            <div className="bg-gray-700 p-2 rounded-full">
                                <Loader2 size={16} className="text-white animate-spin" />
                            </div>
                            <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
                                <p className="text-gray-600">Thinking...</p>
                            </div>
                        </div>
                    </div>
                )}
            </>
        )}
        <div ref={messagesEndRef} />
    </div>
}