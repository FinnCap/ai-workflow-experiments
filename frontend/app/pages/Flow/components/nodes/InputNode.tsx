import { type NodeProps, Position } from '@xyflow/react';
import { ArrowRight } from 'lucide-react';
import type { NodeData } from '~/pages/Flow/common/flow-type';
import { BaseNode } from './BaseNode';


// Node components with integrated handles
export function InputNode({ data, selected }: NodeProps) {
    return (
        <BaseNode
            data={data as NodeData}
            type="input"
            selected={selected}
            handles={[
                { type: 'source', position: Position.Right, connectionLimit: 1 }
            ]}
            NodeIcon={ArrowRight} nodeColors='bg-green-100 border-green-300 text-green-900' />
    );
}
