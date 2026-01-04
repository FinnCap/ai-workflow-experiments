import { useEffect, useRef, useState } from 'react';
import type { Agent } from '~/pages/Agent/common/agent-type';
import type { Chat } from '~/pages/Chat/common/chat-type';
import type { Message, PDFContent, SendMessageRequest } from '~/pages/Chat/common/message-type';
import { selectFiles } from '~/utils/handleFileSelect';

interface UseChatAreaProps {
    selectedChat: Chat | null;
    agents: Agent[];
    messages: Message[];
    messageInput: string;
    isSending: boolean;
    onMessageInputChange: (value: string) => void;
    onSendMessage: (message: SendMessageRequest) => void;
}

export function useChatArea({
    selectedChat,
    agents,
    messages,
    messageInput,
    isSending,
    onMessageInputChange,
    onSendMessage,
}: UseChatAreaProps) {
    const [showVariables, setShowVariables] = useState(false);
    const [apiVariables, setApiVariables] = useState<Record<string, Record<string, string>>>({});
    const [apiHeaders, setApiHeaders] = useState<Record<string, Record<string, string>>>({});
    const [attachedFiles, setAttachedFiles] = useState<PDFContent[]>([]);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Load agent variables and headers when chat changes
        if (selectedChat?.agent_id) {
            const agent = agents.find(a => a.id === selectedChat.agent_id);
            if (agent) {
                // Organize variables by API
                const variablesByApi: Record<string, Record<string, string>> = {};
                const headersByApi: Record<string, Record<string, string>> = {};

                agent.api_models.forEach(api => {
                    if (Object.keys(api.variables).length > 0) {
                        variablesByApi[api.id] = {};
                        Object.entries(api.variables).forEach(([key, value]) => {
                            variablesByApi[api.id][key] = value || '';
                        });
                    }

                    if (Object.keys(api.headers).length > 0) {
                        headersByApi[api.id] = {};
                        Object.entries(api.headers).forEach(([key, value]) => {
                            headersByApi[api.id][key] = value || '';
                        });
                    }
                });

                setApiVariables(variablesByApi);
                setApiHeaders(headersByApi);
            }
        } else {
            setApiVariables({});
            setApiHeaders({});
        }
    }, [selectedChat, agents]);


    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles: PDFContent[] = await selectFiles(event)
        setAttachedFiles(prev => [...prev, ...newFiles]);

        // Clear the input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeAttachedFile = (index: number) => {
        setAttachedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if ((!messageInput.trim() && attachedFiles.length === 0) || !selectedChat || isSending) return;

        const userMessage = messageInput.trim();

        // Create the message request with PDF data if any
        const messageRequest: SendMessageRequest = {
            content: userMessage,
            agentCallVariables: apiVariables,
            agentCallHeaders: apiHeaders,
        };

        // Add PDF data if any files are attached
        if (attachedFiles.length > 0) {
            messageRequest.pdf_data = attachedFiles
        }

        onSendMessage(messageRequest);

        // Clear files after sending
        setAttachedFiles([]);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e as any);
        }
    };

    const handleVariableChange = (apiId: string, key: string, value: string) => {
        setApiVariables(prev => ({
            ...prev,
            [apiId]: {
                ...prev[apiId],
                [key]: value
            }
        }));
    };

    const handleHeaderChange = (apiId: string, key: string, value: string) => {
        setApiHeaders(prev => ({
            ...prev,
            [apiId]: {
                ...prev[apiId],
                [key]: value
            }
        }));
    };

    const currentAgent = selectedChat?.agent_id
        ? agents.find(a => a.id === selectedChat.agent_id)
        : null;

    const hasVariables = currentAgent &&
        currentAgent.api_models.some(api => Object.keys(api.variables).length > 0);

    const hasHeaders = currentAgent &&
        currentAgent.api_models.some(api => Object.keys(api.headers).length > 0);

    const hasSettings = hasVariables || hasHeaders;

    const apisWithSettings = currentAgent?.api_models.filter(api =>
        Object.keys(api.variables).length > 0 || Object.keys(api.headers).length > 0
    ) || [];

    return {
        // State
        showVariables,
        setShowVariables,
        apiVariables,
        apiHeaders,
        attachedFiles,

        // Refs
        messagesEndRef,
        inputRef,
        fileInputRef,

        // Handlers
        handleFileSelect,
        removeAttachedFile,
        handleSendMessage,
        handleKeyPress,
        handleVariableChange,
        handleHeaderChange,

        // Computed values
        currentAgent,
        hasVariables,
        hasHeaders,
        hasSettings,
        apisWithSettings,
    };
}