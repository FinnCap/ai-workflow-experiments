import type { Api } from "~/pages/Api/common/api-type";

interface HeaderSectionProps {
    api: Api;
    apiHeaders: Record<string, Record<string, string>>;
    handleHeaderChange: (apiId: string, key: string, value: string) => void;
}

export default function HeaderSection({ api, apiHeaders, handleHeaderChange }: HeaderSectionProps) {

    return <div className="space-y-2">
        <h5 className="text-xs font-medium text-green-600 uppercase tracking-wide">Headers</h5>
        <div className="space-y-2">
            {Object.entries(api.headers).map(([key, defaultValue]) => (
                <div key={key} className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-700 min-w-0 flex-shrink-0">
                        {key}:
                    </span>
                    <input
                        type="text"
                        value={apiHeaders[api.id]?.[key] || ''}
                        onChange={(e) => handleHeaderChange(api.id, key, e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder={defaultValue ? `Default: ${defaultValue}` : "Enter header value..."}
                    />
                </div>
            ))}
        </div>
    </div>
}