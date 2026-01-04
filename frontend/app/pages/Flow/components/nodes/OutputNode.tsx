import { type NodeProps, Position } from '@xyflow/react';
import { ArrowLeft } from 'lucide-react';
import type { NodeData } from '~/pages/Flow/common/flow-type';
import { BaseNode } from './BaseNode';


export function OutputNode({ data, selected }: NodeProps) {
    return (
        <BaseNode
            data={data as NodeData}
            type="output"
            selected={selected}
            handles={[
                { type: 'target', position: Position.Left, connectionLimit: 1 }
            ]}
            NodeIcon={ArrowLeft}
            nodeColors='bg-blue-100 border-blue-300 text-blue-900'
        />
    );
}