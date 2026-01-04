import type { NestedApiProperty } from "~/pages/Api/common/nested-api-property";

interface NameColumnProps {
    value: string;
    currentPath: number[];
    onUpdate: (path: number[], field: keyof NestedApiProperty, value: string | boolean) => void;
}

export default function NameColumn({ value, currentPath, onUpdate }: NameColumnProps) {

    return <div className="col-span-6 flex items-center justify-center h-full">
        <input
            type="text"
            value={value}
            onChange={(e) => onUpdate(currentPath, 'name', e.target.value)}
            placeholder="property_name"
            className="w-full px-2 py-1 text-sm bg-gray-100 border-0 focus:outline-none focus:bg-blue-50 rounded"
        />
    </div>
}