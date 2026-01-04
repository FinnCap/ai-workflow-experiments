import { Bot, GitBranch, Merge, Split } from 'lucide-react';
import type { DragEvent } from 'react';


const nodeTypes = [
  { type: 'agent', label: 'Agent', icon: Bot, description: 'AI agent processing' },
  { type: 'decision', label: 'Decision', icon: GitBranch, description: 'Conditional branching' },
  { type: 'parallel', label: 'parallel', icon: Split, description: 'Parallel branching' },
  { type: 'merge', label: 'Merge', icon: Merge, description: 'Merge branching' },
];

export default function FlowSidebar() {
  const onDragStart = (event: DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 bg-white border-l border-gray-200 p-4 space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Node Types</h3>
        <div className="space-y-2">
          {nodeTypes.map((node) => {
            const Icon = node.icon;
            return (
              <div
                key={node.type}
                className="p-3 border border-gray-200 rounded-lg cursor-move hover:border-primary hover:bg-gray-50 transition-colors"
                draggable
                onDragStart={(e) => onDragStart(e, node.type)}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <Icon size={18} className="text-gray-600" />
                  <span className="font-medium text-sm">{node.label}</span>
                </div>
                <p className="text-xs text-gray-500">{node.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}