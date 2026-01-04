import type { Message, PDFContent, ToolCallContent, ToolResponseContent } from "~/pages/Chat/common/message-type";

export interface GroupedMessage {
    type: 'text' | 'grouped_tool' | 'pdf';
    role: 'assistant' | 'user' | 'tool';
    text?: string;
    pdf?: PDFContent;
    toolCall?: ToolCallContent;
    toolResponse?: ToolResponseContent;
    id: string;
}

export function groupMessagesInOrder(messages: Message[]): GroupedMessage[] {
    const grouped: GroupedMessage[] = [];
    messages = messages.sort((a, b) => a.position_id - b.position_id)
    for (let i = 0; i < messages.length; i++) {
        const message = messages[i];

        if (message.content.type === 'user') {
            if (typeof message.content.content === "string") {
                grouped.push({
                    type: 'text',
                    role: 'user',
                    text: message.content.content,
                    id: message.id
                });
            } else if (Array.isArray(message.content.content)) {
                message.content.content.forEach((content: string | PDFContent) => {
                    if (typeof content === "string") {
                        grouped.push({
                            type: 'text',
                            role: 'user',
                            text: content,
                            id: message.id
                        });
                    } else {
                        grouped.push({
                            type: 'pdf',
                            role: 'user',
                            pdf: content,
                            id: message.id
                        });
                    }
                })
            }

        } else if (message.content.type === 'assistant') {
            if (message.content.content !== undefined && message.content.content !== null && message.content.content !== '') {
                grouped.push({
                    type: 'text',
                    role: 'assistant',
                    text: message.content.content,
                    id: message.id
                });
            }
            if (Array.isArray(message.content.tool_calls)) {
                message.content.tool_calls.forEach(toolCall => {

                    const responseMessage = messages.find(m =>
                        m.content.type === 'tool_response' &&
                        (m.content as ToolResponseContent).tool_call_id === toolCall.tool_call_id
                    );
                    grouped.push({
                        type: 'grouped_tool',
                        role: 'tool',
                        toolCall: toolCall,
                        toolResponse: responseMessage?.content as ToolResponseContent,
                        id: message.id
                    });
                })
            }

        }
    }

    return grouped;
}