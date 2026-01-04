import { X } from "lucide-react";
import { useState } from "react";
import DropDown from "~/components/DropDown";
import InputField from "~/components/InputField";
import PrimaryBtn from "~/components/PrimaryBtn";
import SecondaryBtn from "~/components/SecondaryBtn";
import type { Agent } from "~/pages/Agent/common/agent-type";

export const NewChatModal = ({
    isOpen,
    onClose,
    agents,
    onCreateChat,
    isLoading
}: {
    isOpen: boolean;
    onClose: () => void;
    agents: Agent[];
    onCreateChat: (data: any) => void;
    isLoading: boolean;
}) => {
    const [agentId, setAgentId] = useState<string>(agents.length > 0 ? agents[0].id!! : '');
    const [title, setTitle] = useState('');

    const handleSubmit = () => {
        onCreateChat({
            agent_id: agentId || undefined,
            title: title.trim() || undefined,
        });
    };

    const agentList = () => {
        return new Map(
            agents.map((agent) => [agent.id!!, agent.name])
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-gray-500 opacity-75"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-4">
                    <h3 className="text-lg font-medium text-gray-900">Create New Chat</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="px-6 pb-4 space-y-4">
                    <InputField
                        label="Chat Title (Optional)"
                        value={title}
                        onChange={setTitle}
                        placeholder="e.g., Customer Support Discussion"
                        required={false}
                    />

                    <DropDown
                        label='Agent'
                        value={agentId}
                        options={agentList()}
                        onChange={setAgentId}
                    />
                </form>

                {/* Footer */}
                <div className="px-6 py-3 flex justify-end space-x-3">
                    <SecondaryBtn label='Cancel' onClick={onClose} disabled={isLoading} />
                    <PrimaryBtn
                        label={isLoading ? 'Creating...' : 'Create Chat'}
                        onClick={handleSubmit}
                        disabled={isLoading}
                    />
                </div>
            </div>
        </div>
    );
};