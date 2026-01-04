import { ArrowLeft, Save } from "lucide-react";
import PrimaryBtn from "~/components/PrimaryBtn";

interface FlowHeaderProps {
    error: string | null;
    isSaving: boolean;
    flowName: string;
    flowDescription: string;
    onSetFlowName: (name: string) => void;
    onSetFlowDescription: (description: string) => void;
    onNavigateBack: () => void;
    onSave: () => void;
}

export default function FlowHeader({
    error,
    isSaving,
    flowName,
    flowDescription,
    onSetFlowName,
    onSetFlowDescription,
    onNavigateBack,
    onSave
}: FlowHeaderProps) {

    return <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
                <button
                    onClick={onNavigateBack}
                    className="text-gray-600 hover:text-gray-900 flex-shrink-0 cursor-pointer"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex-1">
                    <input
                        type="text"
                        value={flowName}
                        onChange={(e) => onSetFlowName(e.target.value)}
                        placeholder="Flow name"
                        className="w-full text-xl font-semibold bg-transparent border-none outline-none focus:ring-0"
                    />
                    <input
                        type="text"
                        value={flowDescription}
                        onChange={(e) => onSetFlowDescription(e.target.value)}
                        placeholder="Add description..."
                        className="w-full block text-sm text-gray-600 bg-transparent border-none outline-none mt-1 focus:ring-0"
                    />
                </div>
            </div>
            <PrimaryBtn label={isSaving ? 'Saving...' : 'Save'} onClick={onSave} icon={Save} disabled={isSaving} />
        </div>
        {error && (
            <div className="mt-2 text-sm text-red-600">{error}</div>
        )}
    </div>

}