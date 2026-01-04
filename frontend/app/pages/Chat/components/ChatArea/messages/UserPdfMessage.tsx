import { FileText, User } from "lucide-react";
import type { GroupedMessage } from "~/pages/Chat/utils/orderMessages";

interface UserPdfMessageProps {
    message: GroupedMessage;
}

export const UserPdfMessage = ({ message }: UserPdfMessageProps) => {
    return (
        <div className="flex justify-end mb-4">
            <div className="flex items-start space-x-3 max-w-3xl">
                <div className="flex items-center justify-between bg-red-50 p-3 rounded-lg border border-red-200 mt-2">
                    <div className="flex items-center space-x-3">
                        <FileText size={20} className="text-red-600" />
                        <div>
                            <p className="text-sm font-medium text-gray-900">{message.pdf!.file_name}</p>
                            <p className="text-xs text-gray-500">{message.pdf!.media_type} • {message.pdf!.type}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-blue-600 p-2 rounded-full flex-shrink-0 shadow-sm">
                    <User size={16} className="text-white" />
                </div>
            </div>
        </div>
    );
};