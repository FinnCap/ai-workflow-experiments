import type { NestedApiProperty } from "~/pages/Api/common/nested-api-property";

interface DescriptionColumnProps {
    description: string;
    currentPath: number[];
    onUpdate: (path: number[], field: keyof NestedApiProperty, value: string | boolean) => void;
}

export default function DescriptionColumn({ description, currentPath, onUpdate }: DescriptionColumnProps) {

    return <div className="col-span-10 flex items-center justify-center h-full">
        <textarea
            value={description || ''}
            onChange={(e) => onUpdate(currentPath, 'description', e.target.value)}
            placeholder="Brief description of this property..."
            rows={1}
            className="w-full px-2 py-1 text-sm bg-gray-100 border-0 focus:outline-none rounded"
            onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = target.scrollHeight + 'px';
            }}
        />
    </div>
}