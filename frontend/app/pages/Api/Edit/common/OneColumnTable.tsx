
import TableRowDelete from "./TableRowDelete";

interface OneColumnTableProps {
    values: string[];
    placeholder: string;
    onUpdate: (index: number, value: string) => void;
    onRemove: (index: number) => void;
}

export default function OneColumnTable({ values, placeholder, onUpdate, onRemove }: OneColumnTableProps) {

    return <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-200 border-b border-gray-200">
            Field Name
        </div>
        {values.map((value, index) => (
            <div key={index} className="flex items-center bg-white hover:bg-gray-50 transition-colors">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onUpdate(index, e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 text-sm border-0 bg-transparent focus:outline-none focus:bg-blue-50 rounded-none"
                />
                <TableRowDelete index={index} onDelete={onRemove} />
            </div>
        ))}
    </div>
}
