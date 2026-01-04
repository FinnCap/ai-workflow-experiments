export interface NodeData {
  label: string;
  ioType?: 'text' | 'audio';
  agentId?: string;
  description?: string;
  decisions?: string[];
  [key: string]: any;
}

export interface FlowNode {
  id: string;  // Database UUID
  react_flow_id: string;  // React Flow ID
  type: 'input' | 'output' | 'agent' | 'decision' | 'merge' | 'parallel' | 'function';
  position: { x: number; y: number };
  data: NodeData;
  agent_id?: string;
  agent_name?: string;
}

export interface FlowEdge {
  id: string;  // Database UUID
  react_flow_id: string;  // React Flow ID
  source: string;  // React Flow node ID
  target: string;  // React Flow node ID
  source_handle?: string;
  target_handle?: string;
  label?: string;
}

export interface Flow {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export interface FlowListItem {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  node_count: number;
  edge_count: number;
}

export interface CreateFlowRequest {
  name: string;
  description?: string;
  nodes?: Array<{
    react_flow_id: string;
    type: string;
    position: { x: number; y: number };
    data: NodeData;
    agent_id?: string;
  }>;
  edges?: Array<{
    react_flow_id: string;
    source: string;
    target: string;
    label?: string;
    source_handle?: string | null,
    target_handle?: string | null,
  }>;
}

export interface UpdateFlowRequest {
  name?: string;
  description?: string;
  nodes?: Array<{
    react_flow_id: string;
    type: string;
    position: { x: number; y: number };
    data: NodeData;
    agent_id?: string;
  }>;
  edges?: Array<{
    react_flow_id: string;
    source: string;
    target: string;
    label?: string;
    source_handle?: string | null,
    target_handle?: string | null,
  }>;
}

export interface ExecuteFlowRequest {
  input_str: string;
  agent_call_variables?: Record<string, Record<string, Record<string, string>>>
  agent_call_headers?: Record<string, Record<string, Record<string, string>>>
  pdf_data?: {
    file_name?: string;
    type: string;
    media_type: string;
    data: string; // base64 encoded
  }[];
}

export interface ExecuteFlowResponse {
  flow_response: string;
}