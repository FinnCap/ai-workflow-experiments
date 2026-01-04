import { Trash2 } from "lucide-react";
import type { NestedApiProperty } from "../../../common/nested-api-property";
import DescriptionColumn from "./DescriptionColumn";
import NameColumn from "./NameColumn";
import RequiredColumn from "./RequiredColumn";
import TypeColumn from "./TypeColumn";
import VariableColumn from "./VariableColumn";

interface PropertyRowProps {
    property: NestedApiProperty;
    currentPath: number[];
    isGetRequest: boolean;
    onUpdateProperty: (path: number[], field: keyof NestedApiProperty, value: string | boolean) => void;
    onRemoveProperty: (path: number[]) => void;
}

export default function PropertyRow({ property, currentPath, isGetRequest, onUpdateProperty, onRemoveProperty }: PropertyRowProps) {

    const getPropertyIndicator = (): string => {
        if (property.type === 'string') {
            return "Ab"
        }
        if (property.type === 'number') {
            return "12"
        }
        if (property.type === 'boolean') {
            return "T/F"
        }
        if (property.type === 'object') {
            return "{}"
        }
        return '[]'
    }

    return <div className="flex items-center space-x-3 p-3 bg-white hover:bg-gray-50 transition-colors rounded-lg border border-transparent hover:border-gray-200">
        {/* Type indicator */}
        <div className="flex-shrink-0">
            <div className={`w-6 h-6 rounded text-xs font-medium flex items-center justify-center bg-gray-600 text-white`}>
                {getPropertyIndicator()}
            </div>
        </div>

        {/* Property details */}
        <div className="flex-1 min-w-0">
            <div className="grid grid-cols-24 gap-3 items-start">
                {/* Name */}
                <NameColumn
                    value={property.name}
                    currentPath={currentPath}
                    onUpdate={onUpdateProperty}
                />

                {/* Type */}
                <TypeColumn
                    value={property.type}
                    isGetRequest={isGetRequest}
                    currentPath={currentPath}
                    onUpdate={onUpdateProperty}
                />

                {/* Variable */}
                <VariableColumn
                    value={property.predefined_variable_name || ''}
                    currentPath={currentPath}
                    onUpdate={onUpdateProperty}
                />

                {/* Description */}
                <DescriptionColumn
                    description={property.description || ''}
                    currentPath={currentPath}
                    onUpdate={onUpdateProperty}
                />

                {/* Required checkbox */}
                <RequiredColumn
                    value={property.required}
                    currentPath={currentPath}
                    onUpdate={onUpdateProperty}
                />
            </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 transition-opacity">
            <button
                type="button"
                onClick={() => onRemoveProperty(currentPath)}
                className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
            >
                <Trash2 size={16} />
            </button>
        </div>
    </div>
}