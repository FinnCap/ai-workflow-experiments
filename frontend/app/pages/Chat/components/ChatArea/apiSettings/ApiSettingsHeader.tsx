import type { Api } from "~/pages/Api/common/api-type";
import HeaderSection from "./HeaderSection";
import VariableSection from "./VariableSection";

interface ApiSettingsHeaderProps {
    apisWithSettings: Api[];
    apiVariables: Record<string, Record<string, string>>;
    handleVariableChange: (apiId: string, key: string, value: string) => void;
    apiHeaders: Record<string, Record<string, string>>;
    handleHeaderChange: (apiId: string, key: string, value: string) => void;
}

export default function ApiSettingsHeader({ apisWithSettings, apiVariables, handleVariableChange, apiHeaders, handleHeaderChange }: ApiSettingsHeaderProps) {

    return <div className="space-y-6">
        {apisWithSettings.map((api) => (
            <div key={api.id} className="space-y-3">
                <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide border-b border-gray-200 pb-1">
                    {api.tool_description.name || `API ${api.id.slice(0, 8)}`}
                </h4>
                <div className="ml-2 space-y-4">
                    {/* Variables Section */}
                    {Object.keys(api.variables).length > 0 && (
                        <VariableSection api={api} apiVariables={apiVariables} handleVariableChange={handleVariableChange} />
                    )}

                    {/* Headers Section */}
                    {Object.keys(api.headers).length > 0 && (
                        <HeaderSection api={api} apiHeaders={apiHeaders} handleHeaderChange={handleHeaderChange} />
                    )}
                </div>
            </div>
        ))}
    </div>
}