import type { NestedApiProperty } from "~/pages/Api/common/nested-api-property";

interface RequiredColumnProps {
    value: boolean;
    currentPath: number[];
    onUpdate: (path: number[], field: keyof NestedApiProperty, value: string | boolean) => void;
}

export default function RequiredColumn({ value, currentPath, onUpdate }: RequiredColumnProps) {

    return <div className="col-span-1 flex items-center justify-center h-full">
        <input
            type="checkbox"
            checked={value}
            onChange={(e) => onUpdate(currentPath, 'required', e.target.checked)}
            className="rounded text-gray-800 focus:ring-gray-500"
        />
    </div>

}