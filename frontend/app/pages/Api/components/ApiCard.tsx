import { Code2 } from "lucide-react";
import DeleteBtn from "~/components/DeleteBtn";
import type { Api } from "../common/api-type";

interface ApiCardProps {
    api: Api;
    handleNavigateToEdit: (id: string) => void;
    handleDelete: (id: string) => void;
}

export default function ApiCard({ api, handleNavigateToEdit, handleDelete }: ApiCardProps) {
    const activeColor = (): string => {
        return api.active
            ? 'bg-green-50 text-green-700 border-green-200'
            : 'bg-gray-50 text-gray-600 border-gray-200';
    }

    return (
        <div
            key={api.id}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-gray-300 transition-all cursor-pointer group"
            onClick={() => handleNavigateToEdit(api.id)}
        >
            {/* Header Section */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4 flex-1 min-w-0">
                    {/* Icon */}
                    <div className="flex-shrink-0 bg-gray-100 p-3 rounded-lg group-hover:bg-gray-200 transition-colors">
                        <Code2 size={20} className="text-gray-700 transition-colors" />
                    </div>

                    {/* Title and Status */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-lg mb-2 truncate">
                            {api.tool_description.name}
                        </h3>
                        <span className={`inline-flex items-center text-xs font-medium px-3 py-1 rounded-full border ${activeColor()}`}>
                            {api.active ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>


                <DeleteBtn id={api.id} onDelete={handleDelete} />
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                {api.tool_description.description}
            </p>
        </div>
    );
}