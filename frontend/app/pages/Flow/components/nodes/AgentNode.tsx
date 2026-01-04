import { type NodeProps, Position } from '@xyflow/react';
import { Bot } from 'lucide-react';
import type { NodeData } from '~/pages/Flow/common/flow-type';
import { BaseNode } from './BaseNode';

export function AgentNode({ data, selected }: NodeProps) {
    return (
        <BaseNode
            data={data as NodeData}
            type="agent"
            selected={selected}
            handles={[
                { type: 'target', position: Position.Left, connectionLimit: 1 },
                { type: 'source', position: Position.Right, connectionLimit: 1 }
            ]}
            NodeIcon={Bot}
            nodeColors='bg-purple-100 border-purple-300 text-purple-900'
        />
    );
}