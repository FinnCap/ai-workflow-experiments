import { Code2 } from "lucide-react";
import type { Api } from "~/pages/Api/common/api-type";

interface AgentApiCardProps {
    api: Api;
    isSelected: boolean;
    onToggleApi: (id: string) => void;
}

export default function AgentApiCard({ api, isSelected, onToggleApi }: AgentApiCardProps) {
    const selectedStyle = (): string => {
        return isSelected
            ? 'border-gray-300 bg-gray-50 shadow-sm'
            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50';
    }

    const activeColor = (): string => {
        return api.active
            ? 'bg-green-50 text-green-700 border-green-200'
            : 'bg-gray-50 text-gray-600 border-gray-200';
    }

    const iconBgColor = (): string => {
        return isSelected ? 'bg-gray-400' : 'bg-gray-100 group-hover:bg-gray-200'
    }

    const iconColor = (): string => {
        return isSelected ? 'text-gray-700' : 'text-gray-700'
    }

    return (
        <label
            key={api.id}
            className={`flex items-start space-x-4 p-4 rounded-xl border cursor-pointer transition-all group ${selectedStyle()}`}
        >
            {/* Checkbox */}
            <div className="flex-shrink-0 mt-0.5">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleApi(api.id!)}
                    className="w-4 h-4 rounded border-gray-300 text-gray-800 focus:ring-gray-500 focus:ring-offset-0 cursor-pointer"
                />
            </div>

            {/* Icon */}
            <div className={`flex-shrink-0 p-2.5 rounded-lg transition-colors ${iconBgColor()}`}>
                <Code2 size={18} className={`transition-colors ${iconColor()}`} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-gray-900">
                        {api.tool_description.name}
                    </span>
                    <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full border ${activeColor()}`}>
                        {api.active ? 'Active' : 'Inactive'}
                    </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                    {api.tool_description.description}
                </p>
            </div>
        </label>
    );
}