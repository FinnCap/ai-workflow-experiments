import { Calendar, Edit, GitBranch, Layers, Play } from "lucide-react";
import DeleteBtn from "~/components/DeleteBtn";
import PrimaryBtn from "~/components/PrimaryBtn";
import SecondaryBtn from "~/components/SecondaryBtn";
import { formatDate } from "~/utils/formatDates";
import type { FlowListItem } from "../common/flow-type";

interface FlowCardProps {
    flow: FlowListItem;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onTest: (id: string) => void;
}

export default function FlowCard({ flow, onEdit, onDelete, onTest }: FlowCardProps) {

    return <div
        key={flow.id}
        className="bg-white flex flex-col h-full rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
    >
        <div className="p-6 flex-grow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="bg-sky-50 p-2 rounded-lg">
                        <GitBranch size={24} className="text-sky-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">{flow.name}</h3>
                    </div>
                </div>
                <DeleteBtn id={flow.id} onDelete={onDelete} />
            </div>

            {flow.description && (
                <p className="text-gray-600 text-sm mb-4">{flow.description}</p>
            )}

            <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                    <Layers size={16} className="mr-2" />
                    <span>{flow.node_count} nodes, {flow.edge_count} connections</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                    <Calendar size={16} className="mr-2" />
                    <span>Updated {formatDate(flow.updated_at)}</span>
                </div>
            </div>
        </div>

        {/* Action Buttons - will stick to bottom */}
        <div className="px-6 py-3 border-t border-gray-200 flex rounded-b-lg mt-auto justify-between">
            <SecondaryBtn label="Test" onClick={() => onTest(flow.id)} icon={Play} />
            <PrimaryBtn label="Edit" onClick={() => onEdit(flow.id)} icon={Edit} />
        </div>
    </div>
}