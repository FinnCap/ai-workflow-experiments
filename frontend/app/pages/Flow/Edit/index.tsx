import {
    Background,
    Controls,
    ReactFlow,
    ReactFlowProvider
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import LoadingView from '~/components/LoadingView';
import FlowSidebar from '~/pages/Flow/Edit/components/FlowSidebar';
import NodePropertiesPanel from '~/pages/Flow/components/NodePropertiesPanel';
import type { Route } from '../../../+types/root';
import { nodeTypes } from '../common/nodeTypes';
import FlowHeader from './components/FlowHeader';
import { useFlowEdit } from './hooks/useFlowEdit';

function FlowCanvas() {
    const {
        isLoading,
        error,

        flowDescription,
        setFlowDescription,
        flowName,
        setFlowName,

        handleSave,
        isSaving,

        nodes,
        onNodesChange,
        edges,
        onEdgesChange,
        onConnect,
        onNodeClick,
        onDrop,
        onDragOver,

        selectedNode,
        setSelectedNode,
        handleNodeUpdate,
        updateEdgeLabels,

        handleNavigateBack
    } = useFlowEdit();

    if (isLoading) {
        return <LoadingView label='Loading flow...' />
    }

    return (
        <div className="flex flex-col h-full w-full">
            <FlowHeader
                error={error}
                isSaving={isSaving}
                flowName={flowName}
                flowDescription={flowDescription}
                onSetFlowName={setFlowName}
                onSetFlowDescription={setFlowDescription}
                onNavigateBack={handleNavigateBack}
                onSave={handleSave}
            />

            {/* Canvas */}
            <div className="flex-1 flex">
                <div className="flex-1 relative">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onNodeClick={onNodeClick}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        nodeTypes={nodeTypes}
                        fitView
                    >
                        <Background />
                        <Controls />
                    </ReactFlow>

                    {selectedNode && (
                        <NodePropertiesPanel
                            node={selectedNode}
                            onClose={() => setSelectedNode(null)}
                            onUpdate={handleNodeUpdate}
                            onUpdateEdgeLabels={updateEdgeLabels}
                        />
                    )}
                </div>

                <FlowSidebar />
            </div>
        </div>
    );
}

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Edit Flow - AI Platform" },
        { name: "description", content: "Create or edit AI workflow" },
    ];
}

export default function FlowEdit() {
    return (
        <ReactFlowProvider>
            <FlowCanvas />
        </ReactFlowProvider>
    );
}