import { type NodeProps, Position } from '@xyflow/react';
import { Merge } from 'lucide-react';
import type { NodeData } from '~/pages/Flow/common/flow-type';
import { BaseNode, type HandleConfig } from './BaseNode';


export function MergeNode({ data, selected }: NodeProps) {
    const handles: HandleConfig[] = [
        { type: 'target', position: Position.Left, connectionLimit: 10 },
        { type: 'source', position: Position.Right, connectionLimit: 1 }
    ];

    return (
        <BaseNode
            data={data as NodeData}
            type="merge"
            NodeIcon={Merge}
            nodeColors='bg-indigo-100 border-indigo-300 text-indigo-900'
            selected={selected}
            handles={handles}
        />
    );
}