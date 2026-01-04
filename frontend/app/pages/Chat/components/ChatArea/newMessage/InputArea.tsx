import type { PDFContent } from "~/pages/Chat/common/message-type";
import AttachedFilesDisplay from "./AttachedFilesDisplay";
import NewMessageArea from "./NewMessageArea";


interface InputAreaProps {
    handleSendMessage: (e: React.FormEvent<Element>) => void;
    inputRef: React.RefObject<HTMLTextAreaElement | null>;
    messageInput: string;
    onMessageInputChange: (value: string) => void;
    handleKeyPress: (e: React.KeyboardEvent<Element>) => void;
    isSending: boolean
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;

    removeAttachedFile: (index: number) => void;
    attachedFiles: PDFContent[]
}

export default function InputArea({
    handleSendMessage,
    inputRef,
    messageInput,
    onMessageInputChange,
    handleKeyPress,
    isSending,
    fileInputRef,
    handleFileSelect,
    removeAttachedFile,
    attachedFiles
}: InputAreaProps) {

    return <div className="bg-white border-t border-gray-200 p-4">
        {attachedFiles.length > 0 && (
            <AttachedFilesDisplay
                removeAttachedFile={removeAttachedFile}
                attachedFiles={attachedFiles}
            />
        )}

        <NewMessageArea
            handleSendMessage={handleSendMessage}
            inputRef={inputRef}
            messageInput={messageInput}
            onMessageInputChange={onMessageInputChange}
            handleKeyPress={handleKeyPress}
            isSending={isSending}
            fileInputRef={fileInputRef}
            handleFileSelect={handleFileSelect}
            attachedFiles={attachedFiles}
        />
    </div>
}