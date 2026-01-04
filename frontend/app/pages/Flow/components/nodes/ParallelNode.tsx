import { Position, type NodeProps } from '@xyflow/react';
import { Split } from 'lucide-react';
import type { NodeData } from '~/pages/Flow/common/flow-type';
import { BaseNode, type HandleConfig } from './BaseNode';


export function ParallelNode({ data, selected }: NodeProps) {
    const handles: HandleConfig[] = [
        { type: 'target', position: Position.Left, connectionLimit: 1 },
        { type: 'source', position: Position.Right, connectionLimit: 10 }
    ];

    return (
        <BaseNode
            data={data as NodeData}
            type="parallel"
            selected={selected}
            handles={handles}
            NodeIcon={Split}
            nodeColors='bg-cyan-100 border-cyan-300 text-cyan-900' />
    );
}
