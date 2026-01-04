import { User } from "lucide-react";
import type { GroupedMessage } from "~/pages/Chat/utils/orderMessages";

interface UserTextMessageProps {
    message: GroupedMessage;
}

export const UserTextMessage = ({ message }: UserTextMessageProps) => {

    return (
        <div className="flex justify-end mb-4">
            <div className="flex items-start space-x-3 max-w-xl">
                <div className="bg-blue-600 text-white rounded-lg px-4 py-2 shadow-sm">
                    <pre className="whitespace-pre-wrap font-sans">{message.text}</pre>
                </div>
                <div className="bg-blue-600 p-2 rounded-full flex-shrink-0 shadow-sm">
                    <User size={16} className="text-white" />
                </div>
            </div>
        </div>
    );
};