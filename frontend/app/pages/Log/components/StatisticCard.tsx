import { type LucideIcon } from "lucide-react";

interface StatisticCardProps {
    name: string;
    description: string;
    icon: LucideIcon;
    iconColor: string;
    iconBgColor: string;
}

export default function StatisticCard({
    name,
    description,
    icon: Icon,
    iconColor,
    iconBgColor
}: StatisticCardProps) {

    return <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
            <div className={`${iconBgColor} p-2 rounded-lg mr-3`}>
                <Icon size={24} className={`${iconColor}`} />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-600">{name}</p>
                <p className="text-2xl font-bold text-gray-900">{description}</p>
            </div>
        </div>
    </div>
}