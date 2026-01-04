import { Bot, ChevronDown, ChevronUp } from "lucide-react";
import type { Agent } from "~/pages/Agent/common/agent-type";
import type { Api } from "~/pages/Api/common/api-type";
import type { Chat } from "../../common/chat-type";
import ApiSettingsHeader from "./apiSettings/ApiSettingsHeader";


interface ChatAreaHeaderProps {
    selectedChat: Chat;
    currentAgent?: Agent | null;
    hasSettings: boolean;
    showVariables: boolean;
    setShowVariables: (newValue: boolean) => void;
    apisWithSettings: Api[];
    apiVariables: Record<string, Record<string, string>>;
    handleVariableChange: (apiId: string, key: string, value: string) => void
    apiHeaders: Record<string, Record<string, string>>;
    handleHeaderChange: (apiId: string, key: string, value: string) => void;
}

export default function ChatAreaHeader({
    selectedChat, currentAgent, hasSettings, showVariables, setShowVariables, apisWithSettings, apiVariables, handleVariableChange, apiHeaders, handleHeaderChange
}: ChatAreaHeaderProps) {

    return <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        {selectedChat.title || 'Untitled Chat'}
                    </h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span className="flex items-center space-x-1">
                            <Bot size={14} />
                            <span>{currentAgent?.name || 'No Agent'}</span>
                        </span>
                        <span>•</span>
                        <span>{currentAgent?.model_provider} - {currentAgent?.model_name || ''}</span>
                    </div>
                </div>

                {hasSettings && (
                    <button
                        onClick={() => setShowVariables(!showVariables)}
                        className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        title="Configure API Variables & Headers"
                    >
                        {showVariables ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        <span className="text-sm">Settings</span>
                    </button>
                )}
            </div>
        </div>

        {/* Expandable Variables & Headers Section */}
        {hasSettings && showVariables && (
            <div className="px-6 pb-4 border-t border-gray-100 bg-gray-50">
                <div className="pt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-4">API Settings</h3>
                    <ApiSettingsHeader
                        apisWithSettings={apisWithSettings}
                        apiVariables={apiVariables}
                        handleVariableChange={handleVariableChange}
                        apiHeaders={apiHeaders}
                        handleHeaderChange={handleHeaderChange}
                    />
                </div>
            </div>
        )}
    </div>
}