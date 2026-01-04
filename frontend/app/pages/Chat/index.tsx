// app/routes/testing.tsx
import { MessageSquare, Plus } from 'lucide-react';
import LoadingView from '~/components/LoadingView';
import PrimaryBtn from '~/components/PrimaryBtn';
import { ChatArea } from '~/pages/Chat/components/ChatArea/ChatArea';
import { NewChatModal } from '~/pages/Chat/components/NewChatModal';
import type { Route } from '../../+types/root';
import { ChatList } from './components/ChatList';
import { useChat } from './hooks/useChat';

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Chat - AI Platform" },
        { name: "description", content: "Test your AI agents and chat with them" },
    ];
}

export default function Chat() {
    const {
        chats,
        agents,
        selectedChat,
        messages,
        showNewChatModal,
        messageInput,
        isLoading,
        isSending,
        isCreatingChat,
        setShowNewChatModal,
        setMessageInput,
        handleSelectChat,
        handleCreateChat,
        handleDeleteChat,
        handleSendMessage,
    } = useChat();

    if (isLoading) {
        return <LoadingView label='Loading chats...' />
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold text-gray-900">Chats</h1>
                        <PrimaryBtn
                            label='New Chat' onClick={() => setShowNewChatModal(true)} icon={Plus}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {chats.length === 0 ? (
                        <div className="text-center py-8">
                            <MessageSquare size={32} className="mx-auto text-gray-400 mb-2" />
                            <p className="text-gray-600">No chats yet</p>
                            <p className="text-sm text-gray-500 mt-1">Create a new chat to get started</p>
                        </div>
                    ) : (
                        <ChatList
                            chats={chats}
                            agents={agents}
                            selectedChatId={selectedChat?.id}
                            onSelectChat={handleSelectChat}
                            onDeleteChat={handleDeleteChat}
                        />
                    )}
                </div>
            </div>

            <ChatArea
                selectedChat={selectedChat}
                agents={agents}
                messages={messages}
                messageInput={messageInput}
                isSending={isSending}
                onMessageInputChange={setMessageInput}
                onSendMessage={handleSendMessage}
            />

            <NewChatModal
                isOpen={showNewChatModal}
                onClose={() => setShowNewChatModal(false)}
                agents={agents}
                onCreateChat={handleCreateChat}
                isLoading={isCreatingChat}
            />
        </div>
    );
}