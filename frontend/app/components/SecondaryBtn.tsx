import { type LucideIcon } from "lucide-react";

interface SecondaryBtnProps {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
    disabled?: boolean;
}

export default function SecondaryBtn({ label, onClick, icon: Icon, disabled = false }: SecondaryBtnProps) {

    return <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-200 cursor-pointer"
    >
        {Icon && <Icon size={16} />}
        <span>{label}</span>
    </button>

}