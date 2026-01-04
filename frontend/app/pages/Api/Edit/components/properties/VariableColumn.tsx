import type { NestedApiProperty } from "~/pages/Api/common/nested-api-property";

interface VariableColumnProps {
    value: string;
    currentPath: number[];
    onUpdate: (path: number[], field: keyof NestedApiProperty, value: string | boolean) => void;
}

export default function VariableColumn({ value, currentPath, onUpdate }: VariableColumnProps) {

    return <div className="col-span-4 flex items-center justify-center h-full">
        <input
            type="text"
            value={value || ''}
            onChange={(e) => onUpdate(currentPath, 'predefined_variable_name', e.target.value)}
            placeholder="var_name"
            className="w-full px-2 py-1 text-sm bg-gray-100 border-0 focus:outline-none rounded"
        />
    </div>
}