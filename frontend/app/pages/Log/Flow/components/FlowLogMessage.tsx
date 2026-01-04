import { Check, Copy } from "lucide-react";

interface FlowLogMessageProps {
    index: number;
    msg: string;
    copiedItems: Set<string>;
    copyToClipboard: (text: string, itemId: string) => Promise<void>;
}

export default function FlowLogMessage({ index, msg, copiedItems, copyToClipboard }: FlowLogMessageProps) {

    return <div key={index} className="bg-gray-50 rounded p-3 mb-2">
        <div className="flex items-start justify-between">
            <div className="flex-1 break-words">
                {msg}
            </div>
            <button
                onClick={() => copyToClipboard(msg, `msg-${index}`)}
                className="ml-2 text-gray-400 hover:text-gray-600 flex-shrink-0"
            >
                {copiedItems.has(`msg-${index}`) ? <Check size={14} /> : <Copy size={14} />}
            </button>
        </div>
    </div>
}