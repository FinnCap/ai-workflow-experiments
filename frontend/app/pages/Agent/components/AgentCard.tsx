import { Bot, Clock, Code2, Cpu } from 'lucide-react';
import DeleteBtn from '~/components/DeleteBtn';
import { type Agent } from '../common/agent-type';

interface AgentCardProps {
    agent: Agent;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export default function AgentCard({ agent, onEdit, onDelete }: AgentCardProps) {
    return (
        <div
            className="bg-white cursor-pointer rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-gray-300 transition-all cursor-pointer group"
            onClick={() => onEdit(agent.id!!)}
        >
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1 min-w-0">

                    {/* Icon */}
                    <div className="flex-shrink-0 bg-gray-100 p-3 rounded-lg group-hover:bg-gray-200 transition-colors">
                        <Bot size={20} className="text-gray-700 transition-colors" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        {/* Title */}
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {agent.name}
                        </h3>

                        {/* Description */}
                        {agent.description && (
                            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                                {agent.description}
                            </p>
                        )}

                        <div className="inline-flex items-center space-x-2 text-xs font-medium px-3 py-1.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg mb-3">
                            <Cpu size={14} className="flex-shrink-0" />
                            <span className="capitalize">{agent.model_provider}</span>
                            <span className="text-gray-400">•</span>
                            <span className="font-normal">{agent.model_name}</span>
                        </div>

                        {/* Metadata */}
                        <div className="flex items-center space-x-6 mb-3">
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <Code2 size={16} className="flex-shrink-0" />
                                <span>{agent.api_models.length} {agent.api_models.length === 1 ? 'API' : 'APIs'}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <Clock size={16} className="flex-shrink-0" />
                                <span>{new Date(agent.updated_at!!).toLocaleDateString()}</span>
                            </div>
                        </div>

                        {/* API Tags */}
                        {agent.api_models.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {agent.api_models.map((api) => (
                                    <span
                                        key={api.id}
                                        className="inline-flex items-center text-xs font-medium px-3 py-1 bg-gray-50 text-gray-700 border border-gray-200 rounded-full"
                                    >
                                        {api.tool_description.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <DeleteBtn id={agent.id!!} onDelete={onDelete} />
            </div>
        </div>
    );
}