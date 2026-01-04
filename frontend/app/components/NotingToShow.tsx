import { type LucideIcon } from "lucide-react";

interface NothingToShowProps {
    headline: string;
    description: string;
    onClick: () => void;
    icon: LucideIcon;
    btnText: string;
}

export default function NothingToShow({ headline, description, onClick, icon: Icon, btnText }: NothingToShowProps) {

    return <div className="text-center py-12">
        <Icon size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">{headline}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <button
            onClick={onClick}
            className="items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-600 transition-colors shadow-sm cursor-pointer"
        >
            {btnText}
        </button>
    </div>
}