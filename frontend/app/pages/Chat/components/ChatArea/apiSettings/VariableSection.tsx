import type { Api } from "~/pages/Api/common/api-type";

interface VariableSectionProps {
    api: Api;
    apiVariables: Record<string, Record<string, string>>;
    handleVariableChange: (apiId: string, key: string, value: string) => void;
}

export default function VariableSection({ api, apiVariables, handleVariableChange }: VariableSectionProps) {

    return <div className="space-y-2">
        <h5 className="text-xs font-medium text-blue-600 uppercase tracking-wide">Variables</h5>
        <div className="space-y-2">
            {Object.entries(api.variables).map(([key, defaultValue]) => (
                <div key={key} className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-700 min-w-0 flex-shrink-0">
                        {key}:
                    </span>
                    <input
                        type="text"
                        value={apiVariables[api.id]?.[key] || ''}
                        onChange={(e) => handleVariableChange(api.id, key, e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={defaultValue ? `Default: ${defaultValue}` : "Enter value..."}
                    />
                </div>
            ))}
        </div>
    </div>
}