import { type LucideIcon } from "lucide-react";

interface PrimaryBtnProps {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
    disabled?: boolean;
}

export default function PrimaryBtn({ label, onClick, icon: Icon, disabled = false }: PrimaryBtnProps) {

    return <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-600 transition-colors shadow-sm cursor-pointer"
    >
        {Icon && <Icon size={16} />}
        <span>{label}</span>
    </button>

}