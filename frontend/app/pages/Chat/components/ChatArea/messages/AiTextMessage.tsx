import { Bot, Check, Copy } from "lucide-react";
import { useState } from "react";
import type { GroupedMessage } from "~/pages/Chat/utils/orderMessages";

interface AiTextMessageProps {
    message: GroupedMessage;
}

export const AiTextMessage = ({ message }: AiTextMessageProps) => {

    const [copied, setCopied] = useState(false);

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };


    return (
        <div className="flex justify-start mb-4">
            <div className="flex items-start space-x-3 max-w-xl">
                <div className="bg-gray-700 p-2 rounded-full flex-shrink-0 shadow-sm">
                    <Bot size={16} className="text-white" />
                </div>
                <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Assistant</span>
                        <button
                            onClick={() => copyToClipboard(message.text!)}
                            className="p-1 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                    </div>
                    <div className="text-gray-800">
                        <pre className="whitespace-pre-wrap font-sans">{message.text}</pre>
                    </div>
                </div>
            </div>
        </div>
    );
};