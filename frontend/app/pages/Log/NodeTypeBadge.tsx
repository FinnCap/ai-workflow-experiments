import { Bot, GitBranch, MessageSquare, Settings, Zap } from 'lucide-react';

interface NodeTypeBadgeProps {
    nodeType: string;
    className?: string;
}

export const NodeTypeBadge = ({ nodeType, className = "" }: NodeTypeBadgeProps) => {
    const getNodeTypeInfo = (type: string) => {
        const normalizedType = type.toLowerCase();

        switch (normalizedType) {
            case 'llm':
            case 'ai':
            case 'agent':
                return {
                    icon: <Bot size={12} />,
                    label: 'LLM',
                    color: 'bg-blue-100 text-blue-700 border-blue-200'
                };
            case 'input':
            case 'user_input':
                return {
                    icon: <MessageSquare size={12} />,
                    label: 'Input',
                    color: 'bg-green-100 text-green-700 border-green-200'
                };
            case 'output':
            case 'response':
                return {
                    icon: <MessageSquare size={12} />,
                    label: 'Output',
                    color: 'bg-purple-100 text-purple-700 border-purple-200'
                };
            case 'tool':
            case 'function':
                return {
                    icon: <Settings size={12} />,
                    label: 'Tool',
                    color: 'bg-orange-100 text-orange-700 border-orange-200'
                };
            case 'flow':
            case 'workflow':
                return {
                    icon: <GitBranch size={12} />,
                    label: 'Flow',
                    color: 'bg-indigo-100 text-indigo-700 border-indigo-200'
                };
            default:
                return {
                    icon: <Zap size={12} />,
                    label: type,
                    color: 'bg-gray-100 text-gray-700 border-gray-200'
                };
        }
    };

    const { icon, label, color } = getNodeTypeInfo(nodeType);

    return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${color} ${className}`}>
            {icon}
            <span className="ml-1">{label}</span>
        </span>
    );
};