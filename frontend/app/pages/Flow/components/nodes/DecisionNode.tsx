import { Position, useUpdateNodeInternals, type NodeProps } from '@xyflow/react';
import { GitBranch } from 'lucide-react';
import { useEffect } from 'react';
import type { NodeData } from '~/pages/Flow/common/flow-type';
import { BaseNode, type HandleConfig } from './BaseNode';


export function DecisionNode({ data, selected, id }: NodeProps) {
    const nodeData = data as NodeData;
    const decisions = nodeData.decisions || ['Yes', 'No'];
    const outputCount = Math.max(decisions.length, 1);
    const updateNodeInternals = useUpdateNodeInternals();

    // Force React Flow to update node internals when decisions change
    useEffect(() => {
        if (id) {
            updateNodeInternals(id);
        }
    }, [decisions.length, id, updateNodeInternals]);

    const handles: HandleConfig[] = [
        { type: 'target', position: Position.Left, connectionLimit: 1 }
    ];

    // Create output handles for each decision path
    for (let i = 0; i < outputCount; i++) {
        handles.push({
            type: 'source',
            position: Position.Right,
            id: `output-${i}`,
            style: {
                top: `${((i + 1) / (outputCount + 1)) * 100}%`,
                transform: 'translateY(-50%)'
            },
            connectionLimit: 1
        });
    }

    return (
        <div className="relative">
            <BaseNode
                data={nodeData}
                type="decision"
                selected={selected}
                handles={handles}
                NodeIcon={GitBranch}
                nodeColors='bg-yellow-100 border-yellow-300 text-yellow-900'
            />

            {/* Decision path labels */}
            {decisions.map((path, index) => (
                <div
                    key={`label-${index}`}
                    className="absolute text-xs bg-white border border-gray-300 rounded px-1 py-0.5 text-gray-700 pointer-events-none"
                    style={{
                        right: '-8px',
                        top: `${((index + 1) / (outputCount + 1)) * 100}%`,
                        transform: 'translateY(-50%) translateX(100%)',
                        fontSize: '10px',
                        whiteSpace: 'nowrap',
                        zIndex: 10
                    }}
                >
                    {path}
                </div>
            ))}
        </div>
    );
}