import { Handle, Position, useNodeConnections } from '@xyflow/react';
import { Mic, Type, type LucideIcon } from 'lucide-react';
import type { NodeData } from '~/pages/Flow/common/flow-type';


export interface HandleConfig {
    type: 'source' | 'target';
    position: Position;
    id?: string;
    connectionLimit: number;
    style?: React.CSSProperties;
}

// Individual handle component that can use hooks
function NodeHandle({ handle }: { handle: HandleConfig }) {
    const connections = useNodeConnections({
        handleType: handle.type,
        handleId: handle.id
    });

    return (
        <Handle
            type={handle.type}
            position={handle.position}
            id={handle.id}
            className="w-3 h-3"
            style={handle.style}
            isConnectable={connections.length < handle.connectionLimit}
        />
    );
}

export function BaseNode({
    data,
    type,
    selected,
    NodeIcon,
    nodeColors,
    handles = []
}: {
    data: NodeData;
    type: string;
    selected?: boolean;
    NodeIcon: LucideIcon
    nodeColors: string,
    handles?: HandleConfig[];
}) {

    return (
        <div className={`relative px-4 py-3 rounded-lg border-2 ${nodeColors} ${selected ? 'ring-2 ring-primary ring-offset-2' : ''} min-w-[70px]`}>
            {handles.map((handle, index) => (
                <NodeHandle
                    key={`${handle.type}-${handle.position}-${handle.id || index}`}
                    handle={handle}
                />
            ))}

            <div className="flex items-center space-x-2">
                <NodeIcon size={20} />
                <div className="flex-1">
                    <div className="font-medium text-sm">{data.label}</div>

                    {/* Show node name for parallel and merge nodes */}
                    {(type === 'parallel' || type === 'merge') && data.name && (
                        <div className="text-xs opacity-75 mt-0.5">{data.name}</div>
                    )}

                    {/* Show agent name for agent nodes */}
                    {data.agentName && (
                        <div className="text-xs opacity-75 mt-0.5">{data.agentName}</div>
                    )}

                    {/* Show description for decision nodes */}
                    {type === 'decision' && data.description && (
                        <div className="text-xs opacity-75 mt-0.5 max-w-[120px] truncate" title={data.description}>
                            {data.description}
                        </div>
                    )}

                    {/* Show I/O type for input/output nodes */}
                    {data.ioType && (
                        <div className="flex items-center mt-1">
                            {data.ioType === 'audio' ? <Mic size={12} /> : <Type size={12} />}
                            <span className="text-xs ml-1">{data.ioType}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}