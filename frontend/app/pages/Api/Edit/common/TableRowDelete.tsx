import { Trash2 } from "lucide-react";

interface TableRowDeleteProps {
    index: number;
    onDelete: (index: number) => void;
}

export default function TableRowDelete({ index, onDelete }: TableRowDeleteProps) {

    return <div className="px-3 bg-transparent hover:bg-transparent border-l border-gray-200">
        <button
            type="button"
            onClick={() => onDelete(index)}
            className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
        >
            <Trash2 size={16} />
        </button>
    </div>

}