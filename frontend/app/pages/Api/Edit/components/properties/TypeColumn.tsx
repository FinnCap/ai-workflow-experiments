import type { NestedApiProperty } from "~/pages/Api/common/nested-api-property";

interface TypeColumnProps {
    value: string;
    isGetRequest: boolean;
    currentPath: number[];
    onUpdate: (path: number[], field: keyof NestedApiProperty, value: string | boolean) => void;
}

export default function TypeColumn({ value, isGetRequest, currentPath, onUpdate }: TypeColumnProps) {

    return <div className="col-span-3 flex items-center justify-left h-full">
        <select
            value={value}
            onChange={(e) => onUpdate(currentPath, 'type', e.target.value)}
            className="px-2 py-1 text-sm bg-gray-100 border-0 focus:outline-none rounded"
        >
            <option value="string">String</option>
            <option value="number">Number</option>
            <option value="boolean">Boolean</option>
            {!isGetRequest && <option value="object">Object</option>}
            <option value="array">Array</option>
        </select>
    </div>

}