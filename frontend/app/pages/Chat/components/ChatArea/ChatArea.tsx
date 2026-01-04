// app/components/chat-area.tsx
import { MessageSquare } from 'lucide-react';
import type { Agent } from '~/pages/Agent/common/agent-type';
import type { Chat } from '../../common/chat-type';
import type { Message, SendMessageRequest } from '../../common/message-type';
import { useChatArea } from '../../hooks/useChatArea';
import ChatAreaHeader from './ChatAreaHeader';
import MessageListOverview from './MessageListOverview';
import InputArea from './newMessage/InputArea';

interface ChatAreaProps {
    selectedChat: Chat | null;
    agents: Agent[];
    messages: Message[];
    messageInput: string;
    isSending: boolean;
    onMessageInputChange: (value: string) => void;
    onSendMessage: (message: SendMessageRequest) => void;
}

export function ChatArea({
    selectedChat,
    agents,
    messages,
    messageInput,
    isSending,
    onMessageInputChange,
    onSendMessage,
}: ChatAreaProps) {
    const {
        showVariables,
        setShowVariables,
        apiVariables,
        apiHeaders,
        attachedFiles,
        messagesEndRef,
        inputRef,
        fileInputRef,
        handleFileSelect,
        removeAttachedFile,
        handleSendMessage,
        handleKeyPress,
        handleVariableChange,
        handleHeaderChange,
        currentAgent,
        hasSettings,
        apisWithSettings,
    } = useChatArea({
        selectedChat,
        agents,
        messages,
        messageInput,
        isSending,
        onMessageInputChange,
        onSendMessage,
    });

    if (!selectedChat) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <MessageSquare size={64} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Select a chat to start</h3>
                    <p className="text-gray-600 mb-6">Choose an existing conversation or create a new one</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <ChatAreaHeader
                selectedChat={selectedChat}
                currentAgent={currentAgent}
                hasSettings={hasSettings || false}
                showVariables={showVariables}
                setShowVariables={setShowVariables}
                apisWithSettings={apisWithSettings}
                apiVariables={apiVariables}
                handleVariableChange={handleVariableChange}
                apiHeaders={apiHeaders}
                handleHeaderChange={handleHeaderChange}
            />

            {/* Messages */}
            <MessageListOverview messages={messages} hasSettings={hasSettings} isSending={isSending} messagesEndRef={messagesEndRef} />

            {/* Input */}
            <InputArea
                handleSendMessage={handleSendMessage}
                inputRef={inputRef}
                messageInput={messageInput}
                onMessageInputChange={onMessageInputChange}
                handleKeyPress={handleKeyPress}
                isSending={isSending}
                fileInputRef={fileInputRef}
                handleFileSelect={handleFileSelect}
                attachedFiles={attachedFiles}
                removeAttachedFile={removeAttachedFile}
            />
        </div>
    );
}