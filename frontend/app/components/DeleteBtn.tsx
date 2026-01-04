import { Trash2 } from "lucide-react";

interface DeleteBtnProps {
    id: string;
    onDelete: (id: string) => void;
}

export default function DeleteBtn({ id, onDelete }: DeleteBtnProps) {

    return <button
        onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
        }}
        className="flex-shrink-0 text-gray-400 hover:text-red-600 p-2 rounded-lg transition-all cursor-pointer"
        aria-label="Delete API"
    >
        <Trash2 size={18} />
    </button>
} 