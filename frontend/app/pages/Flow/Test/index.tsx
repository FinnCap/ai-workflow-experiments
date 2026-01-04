import {
    Background,
    Controls,
    ReactFlow,
    ReactFlowProvider
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import LoadingView from '~/components/LoadingView';
import type { Route } from '../+types';
import { nodeTypes } from '../common/nodeTypes';
import FlowTestDataPanel from './components/FlowTestDataPanel';

import FlowTestHeader from './components/FlowTestHeader';
import { useFlowTest } from './hooks/useFlowTest';

function FlowTestCanvas() {

    const {
        isLoading,
        flow,
        nodes,
        edges,

        showVariables,
        setShowVariables,

        getAgentsWithSettings,

        agentVariables,
        handleVariableChange,

        agentHeaders,
        handleHeaderChange,

        inputRef,
        inputMessage,
        setInputMessage,

        attachedFiles,
        fileInputRef,
        handleFileSelect,
        removeAttachedFile,

        handleKeyPress,

        handleExecuteFlow,
        isExecutingFlow,

        outputMessage,
        error,

        navigateBack

    } = useFlowTest()

    if (isLoading || flow === null) {
        return <LoadingView label='Loading flow...'></LoadingView>
    }

    const agentsWithSettings = getAgentsWithSettings();
    const hasSettings = agentsWithSettings.length > 0;

    return (
        <div className="h-screen flex flex-col h-full w-full">
            <FlowTestHeader flow={flow} navigateBack={navigateBack} />

            <div className="flex-1 flex min-h-0">
                <div className="flex-1 relative">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        nodeTypes={nodeTypes}
                        fitView
                        nodesDraggable={false}
                        nodesConnectable={false}
                        elementsSelectable={false}
                        panOnDrag={true}
                        zoomOnScroll={true}
                        zoomOnPinch={true}
                    >
                        <Background />
                        <Controls showInteractive={false} />
                    </ReactFlow>
                </div>

                {/* Test Panel */}
                <FlowTestDataPanel
                    agentsWithSettings={agentsWithSettings}
                    agentVariables={agentVariables}
                    handleVariableChange={handleVariableChange}
                    agentHeaders={agentHeaders}
                    handleHeaderChange={handleHeaderChange}
                    hasSettings={hasSettings}
                    showVariables={showVariables}
                    setShowVariables={setShowVariables}
                    inputRef={inputRef}
                    inputMessage={inputMessage}
                    setInputMessage={setInputMessage}
                    handleKeyPress={handleKeyPress}
                    fileInputRef={fileInputRef}
                    handleFileSelect={handleFileSelect}
                    attachedFiles={attachedFiles}
                    removeAttachedFile={removeAttachedFile}
                    isExecutingFlow={isExecutingFlow}
                    handleExecuteFlow={handleExecuteFlow}
                    error={error}
                    outputMessage={outputMessage}
                />

            </div>
        </div>
    );
}

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Test Flow - AI Platform" },
        { name: "description", content: "Test your AI workflow" },
    ];
}

export default function FlowTest() {
    return (
        <ReactFlowProvider>
            <FlowTestCanvas />
        </ReactFlowProvider>
    );
}