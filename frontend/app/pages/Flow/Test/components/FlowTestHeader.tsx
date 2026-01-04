import { ArrowLeft, Play } from "lucide-react";
import type { Flow } from "../../common/flow-type";

interface FlowTestHeaderProps {
    flow: Flow;
    navigateBack: () => void;
}

export default function FlowTestHeader({
    flow,
    navigateBack,
}: FlowTestHeaderProps) {

    return <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => navigateBack()}
                    className="text-gray-600 hover:text-gray-900 cursor-pointer"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">{flow.name}</h1>
                    {flow.description && (
                        <p className="text-sm text-gray-600 mt-1">{flow.description}</p>
                    )}
                </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Play size={16} />
                <span>Test Mode</span>
            </div>
        </div>
    </div>

}