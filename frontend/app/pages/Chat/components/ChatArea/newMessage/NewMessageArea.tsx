import { Loader2, Paperclip, Send } from "lucide-react";
import { useEffect } from "react";
import type { PDFContent } from "~/pages/Chat/common/message-type";



interface NewMessageAreaProps {
    handleSendMessage: (e: React.FormEvent<Element>) => void;
    inputRef: React.RefObject<HTMLTextAreaElement | null>;
    messageInput: string;
    onMessageInputChange: (value: string) => void;
    handleKeyPress: (e: React.KeyboardEvent<Element>) => void;
    isSending: boolean
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    attachedFiles: PDFContent[]
}

export default function NewMessageArea({
    handleSendMessage, inputRef, messageInput, onMessageInputChange, handleKeyPress, isSending, fileInputRef, handleFileSelect, attachedFiles
}: NewMessageAreaProps) {


    useEffect(() => {
        const textarea = inputRef.current;
        if (textarea) {
            textarea.style.height = '20px';
            const scrollHeight = textarea.scrollHeight;
            const maxHeight = 200;
            textarea.style.height = Math.min(scrollHeight, maxHeight) + 'px';
        }
    }, [messageInput, inputRef]);

    return <form onSubmit={handleSendMessage} className="flex flex-col w-full p-2 border border-gray-300 rounded-lg">
        <div className="relative">
            <textarea
                ref={inputRef}
                value={messageInput}
                onChange={(e) => onMessageInputChange(e.target.value)}
                onKeyUp={handleKeyPress}
                placeholder="Type your message... (Shift+Enter for new line)"
                className="w-full p-2 focus:outline-none focus:ring-0 focus:ring-blue-500 resize-none overflow-y-auto"
                disabled={isSending}
                style={{ minHeight: '24px', maxHeight: '200px' }}
                rows={1}
            />
        </div>
        <div className="flex gap-2 justify-between mt-2">
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                title="Attach PDF file"
            >
                <Paperclip size={20} />
            </button>
            <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                multiple
                onChange={handleFileSelect}
                className="hidden"
            />
            <button
                type="submit"
                disabled={(!messageInput.trim() && attachedFiles.length === 0) || isSending}
                className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-600 transition-colors shadow-sm cursor-pointer"
            >
                {isSending ? (
                    <Loader2 size={16} className="animate-spin" />
                ) : (
                    <Send size={16} />
                )}
            </button>
        </div>
    </form>
}