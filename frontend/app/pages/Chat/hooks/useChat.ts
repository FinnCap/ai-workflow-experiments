import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { AgentService } from '~/pages/Agent/common/agent-service';
import type { Agent } from '~/pages/Agent/common/agent-type';
import { ChatService } from '~/pages/Chat/common/chat-service';
import type { Chat } from '~/pages/Chat/common/chat-type';
import type { Message, SendMessageRequest, UserContent } from '~/pages/Chat/common/message-type';

export function useChat() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [chats, setChats] = useState<Chat[]>([]);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [messageInput, setMessageInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [isCreatingChat, setIsCreatingChat] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const agentParam = searchParams.get('agent');
    const chatParam = searchParams.get('chat');

    useEffect(() => {
        loadInitialData();
    }, []);

    // Handle deep linking to specific chat
    useEffect(() => {
        if (chatParam && chats.length > 0 && !selectedChat) {
            const targetChat = chats.find(chat => chat.id === chatParam);
            if (targetChat) {
                handleSelectChat(targetChat.id);
            } else {
                // Chat not found in current list, try to load it directly
                loadSpecificChat(chatParam);
            }
        }
    }, [chatParam, chats.length, selectedChat]);

    const loadInitialData = async () => {
        try {
            setIsLoading(true);
            const [chatsData, agentsData] = await Promise.all([
                ChatService.getAllChats(agentParam || undefined),
                AgentService.getAll()
            ]);
            setChats(chatsData);
            setAgents(agentsData);

            // Auto-select the first chat if available and no specific chat requested
            if (chatsData.length > 0 && !selectedChat && !chatParam) {
                handleSelectChat(chatsData[0].id);
            }
        } catch (err) {
            setError('Failed to load data');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Load a specific chat that might not be in the current list
    const loadSpecificChat = async (chatId: string) => {
        try {
            const chat = await ChatService.getChatById(chatId);

            // Add the chat to the list if it's not already there
            setChats(prev => {
                const exists = prev.some(c => c.id === chatId);
                if (exists) return prev;
                return [chat, ...prev];
            });

            // Select the chat
            setSelectedChat(chat);
            setMessages(chat.messages || []);
            setError(null);
        } catch (err) {
            setError(`Failed to load chat ${chatId.slice(0, 8)}...`);
            console.error(err);
            // Remove invalid chat parameter from URL
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.delete('chat');
            setSearchParams(newSearchParams);
        }
    };

    const handleSelectChat = async (chatId: string) => {
        try {
            const chat = await ChatService.getChatById(chatId);
            setSelectedChat(chat);
            setMessages(chat.messages || []);
            setError(null);

            // Update URL to reflect selected chat
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.set('chat', chatId);
            setSearchParams(newSearchParams);
        } catch (err) {
            setError('Failed to load chat');
            console.error(err);
        }
    };

    const handleCreateChat = async (data: {
        model_provider: string;
        model_name: string;
        agent_id?: string;
        title?: string;
    }) => {
        try {
            setIsCreatingChat(true);
            const newChat = await ChatService.createChat({
                ...data,
                use_tools: !!data.agent_id,
            });

            // Reload chats and select the new one
            await loadInitialData();
            await handleSelectChat(newChat.id);
            setShowNewChatModal(false);
        } catch (err) {
            setError('Failed to create chat');
            console.error(err);
        } finally {
            setIsCreatingChat(false);
        }
    };

    const handleDeleteChat = async (chatId: string) => {
        if (!confirm('Are you sure you want to delete this chat?')) return;

        try {
            await ChatService.deleteChat(chatId);

            // If the deleted chat was selected, clear selection and URL
            if (selectedChat?.id === chatId) {
                setSelectedChat(null);
                setMessages([]);
                const newSearchParams = new URLSearchParams(searchParams);
                newSearchParams.delete('chat');
                setSearchParams(newSearchParams);
            }

            // Reload chats
            await loadInitialData();
        } catch (err) {
            setError('Failed to delete chat');
            console.error(err);
        }
    };

    const handleSendMessage = async (message: SendMessageRequest) => {
        if (!message.content.trim() || !selectedChat || isSending) return;

        setMessageInput('');

        try {
            setIsSending(true);

            // Add user message immediately
            const tempUserMessage: Message = {
                id: `temp-${Date.now()}`,
                chat_id: selectedChat.id,
                role: 'user',
                position_id: messages.length,
                content: {
                    type: 'user',
                    content: message.content,
                    token_count: 0,
                } as UserContent,
                created_at: new Date().toISOString(),
            };
            setMessages(prev => [...prev, tempUserMessage]);

            // Send message with variables and get AI response
            const newMessages = await ChatService.sendMessage(
                selectedChat.id,
                message
            );

            // Replace temp message with actual messages from server
            setMessages(prev => {
                const withoutTemp = prev.filter(m => m.id !== tempUserMessage.id);
                return [...withoutTemp, ...newMessages];
            });

        } catch (err) {
            setError('Failed to send message');
            console.error(err);
            // Remove the temporary user message on error
            setMessages(prev => prev.filter(m => m.id !== `temp-${Date.now()}`));
        } finally {
            setIsSending(false);
        }
    };

    return {
        // State
        chats,
        agents,
        selectedChat,
        messages,
        showNewChatModal,
        messageInput,
        isLoading,
        isSending,
        isCreatingChat,
        error,

        // Actions
        setShowNewChatModal,
        setMessageInput,
        setError,
        handleSelectChat,
        handleCreateChat,
        handleDeleteChat,
        handleSendMessage,
    };
}