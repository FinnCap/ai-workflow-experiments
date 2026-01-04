import type { Message } from "~/pages/Chat/common/message-type";
import { GroupedToolDisplay } from "~/pages/Chat/components/ChatArea/messages/GroupedToolDisplay";
import { groupMessagesInOrder, type GroupedMessage } from "../utils/orderMessages";
import { AiTextMessage } from "./ChatArea/messages/AiTextMessage";
import { UserPdfMessage } from "./ChatArea/messages/UserPdfMessage";
import { UserTextMessage } from "./ChatArea/messages/UserTextMessage";

export const MessageList = ({ messages }: { messages: Message[] }) => {
    const groupedMessages = groupMessagesInOrder(messages);
    const renderGroupedMessage = (groupedMessage: GroupedMessage) => {
        if (groupedMessage.type == 'pdf') {
            return <UserPdfMessage message={groupedMessage} />
        }
        if (groupedMessage.type == 'text' && groupedMessage.role == 'user') {
            return <UserTextMessage message={groupedMessage} />
        }
        if (groupedMessage.type == 'text' && groupedMessage.role == 'assistant') {
            return <AiTextMessage message={groupedMessage} />
        }

        if (groupedMessage.type === 'grouped_tool') {
            return <GroupedToolDisplay
                toolCall={groupedMessage.toolCall}
                toolResponse={groupedMessage.toolResponse}
            />
        }

        return null;
    };

    return (
        <div>
            {groupedMessages.map((groupedMessage, index) => (
                <div key={groupedMessage.id + "-" + index}>
                    {renderGroupedMessage(groupedMessage)}
                </div>
            ))}
        </div>
    );
};