import type { Agent } from "~/pages/Agent/common/agent-type";

export interface ChatLogResponse {
  type: 'chat';
  chat_id: string;
  agent: Agent;
  title: string;
  message_count: number;
  input_token_count: number;
  output_token_count: number;
  created_at: string;
  updated_at: string;
}

export interface FlowLogResponse {
  type: 'flow';
  flow_execution_id: string;
  flow_id: string;
  started: string;
  stopped: string;
  total_tokens_in: number;
  total_tokens_out: number;
}

export interface FlowLogModelResponse {
  id: string;
  node_id: string;
  node_type: string;
  in_message: string[] | string;
  out_message: string[] | string;
  total_tokens_in: number;
  total_tokens_out: number;
  // message_log: MessageFlowLogResponse[];
}

export interface FlowLogDetailResponse {
  flow_execution_id: string;
  flow_id: string;
  started: string;
  stopped: string;
  total_tokens_in: number;
  total_tokens_out: number;
  logs: FlowLogModelResponse[];
}