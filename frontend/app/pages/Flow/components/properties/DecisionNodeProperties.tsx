import { Plus, Trash2 } from 'lucide-react';
import TextArea from '~/components/TextArea';
import type { NodeData } from '~/pages/Flow/common/flow-type';

interface DecisionNodePropertiesProps {
    localData: NodeData,
    onDescriptionChange: (description: string) => void,
    onAddDecisionPath: () => void,
    onRemoveDecisionPath: (index: number) => void
    onUpdateDecisionPath: (index: number, value: string) => void
}

export default function DecisionNodeProperties({ localData, onDescriptionChange, onAddDecisionPath, onRemoveDecisionPath, onUpdateDecisionPath }: DecisionNodePropertiesProps) {

    return <>
        <TextArea label='Description' value={localData.description || ''} onChange={onDescriptionChange} required={false} />

        <div>
            <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                    Decision Paths
                </label>
                <button
                    onClick={onAddDecisionPath}
                    className="flex items-center space-x-1 px-2 py-1 text-xs bg-gray-800 text-white rounded hover:bg-gray-600 transition-colors shadow-sm cursor-pointer"
                >
                    <Plus size={12} />
                    <span>Add Path</span>
                </button>
            </div>

            <div className="space-y-2">
                {(localData.decisions as Array<string>)?.map((path, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={path}
                            onChange={(e) => onUpdateDecisionPath(index, e.target.value)}
                            placeholder={`Decision path ${index + 1}`}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        />
                        {localData.decisions && localData.decisions.length > 1 && (
                            <button
                                onClick={() => onRemoveDecisionPath(index)}
                                className="flex-shrink-0 text-gray-400 hover:text-red-600 p-2 rounded-lg transition-all cursor-pointer"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {localData.decisions && localData.decisions.length === 0 && (
                <div className="text-sm text-gray-500 text-center py-4">
                    No decision paths defined. Add at least one path.
                </div>
            )}
        </div>
    </>
}