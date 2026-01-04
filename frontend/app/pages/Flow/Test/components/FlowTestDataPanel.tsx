import { ChevronDown, ChevronUp } from "lucide-react";
import type { Agent } from "~/pages/Agent/common/agent-type";
import type { PDFContent } from "~/pages/Chat/common/message-type";
import AttachedFilesDisplay from "~/pages/Chat/components/ChatArea/newMessage/AttachedFilesDisplay";
import NewMessageArea from "~/pages/Chat/components/ChatArea/newMessage/NewMessageArea";
import FlowApiTestSettings from "./FlowApiTestSettings";

interface FlowTestDataPanelProps {
    agentsWithSettings: Agent[];
    agentVariables: Record<string, Record<string, Record<string, string>>>;
    handleVariableChange: (agentId: string, apiId: string, key: string, value: string) => void;

    agentHeaders: Record<string, Record<string, Record<string, string>>>;
    handleHeaderChange: (agentId: string, apiId: string, key: string, value: string) => void;

    hasSettings: boolean;

    showVariables: boolean;
    setShowVariables: React.Dispatch<React.SetStateAction<boolean>>;

    inputRef: React.RefObject<HTMLTextAreaElement | null>;
    inputMessage: string;
    setInputMessage: React.Dispatch<React.SetStateAction<string>>;

    handleKeyPress: (e: React.KeyboardEvent<Element>) => void;

    fileInputRef: React.RefObject<HTMLInputElement | null>;
    handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;

    attachedFiles: PDFContent[];
    removeAttachedFile: (index: number) => void;

    isExecutingFlow: boolean,
    handleExecuteFlow: () => Promise<void>;

    error: string | null;
    outputMessage: string;
}

export default function FlowTestDataPanel({
    agentsWithSettings,

    agentVariables,
    handleVariableChange,

    agentHeaders,
    handleHeaderChange,

    hasSettings,

    showVariables,
    setShowVariables,

    inputRef,
    inputMessage,
    setInputMessage,

    handleKeyPress,

    fileInputRef,
    handleFileSelect,

    attachedFiles,
    removeAttachedFile,

    isExecutingFlow,
    handleExecuteFlow,

    error,
    outputMessage
}: FlowTestDataPanelProps) {

    return <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        {/* Panel Header */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-gray-900">Test Flow</h3>
                    <p className="text-sm text-gray-600 mt-1">Enter a message or upload PDFs to test the flow</p>
                </div>
                {hasSettings && (
                    <button
                        onClick={() => setShowVariables(!showVariables)}
                        className="flex items-center space-x-1 px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
                        title="Configure API Variables & Headers"
                    >
                        {showVariables ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        <span className="text-xs">Settings</span>
                    </button>
                )}
            </div>
        </div>

        {/* Settings Section */}
        {hasSettings && showVariables && (
            <FlowApiTestSettings agentsWithSettings={agentsWithSettings} agentVariables={agentVariables} handleVariableChange={handleVariableChange} agentHeaders={agentHeaders} handleHeaderChange={handleHeaderChange} />

        )}

        {/* Scrollable Content Area */}
        <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Flow Input
                </label>
                {attachedFiles.length > 0 && (
                    <AttachedFilesDisplay removeAttachedFile={removeAttachedFile} attachedFiles={attachedFiles} />

                )}

                <NewMessageArea
                    handleSendMessage={handleExecuteFlow}
                    inputRef={inputRef}
                    messageInput={inputMessage}
                    onMessageInputChange={setInputMessage}
                    handleKeyPress={handleKeyPress}
                    isSending={isExecutingFlow}
                    fileInputRef={fileInputRef}
                    handleFileSelect={handleFileSelect}
                    attachedFiles={attachedFiles}
                />

                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                {/* Output Section */}
                <div className="flex-1 min-h-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Flow Output
                    </label>
                    <div className="h-full min-h-[200px] p-3 border border-gray-300 rounded-lg bg-gray-50">
                        {outputMessage ? (
                            <p className="text -sm text-gray-900 whitespace-pre-wrap">{outputMessage}</p>
                        ) : (
                            <p className="text-sm text-gray-500 italic">
                                Output will appear here after executing the flow
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
}