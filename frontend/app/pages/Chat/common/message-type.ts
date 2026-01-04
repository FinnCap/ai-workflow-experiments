export interface Message {
  id: string;
  chat_id: string;
  role: 'assistant' | 'user' | 'tool_call' | 'tool_response' | 'pdf';
  position_id: number;
  content: AssistantContent | UserContent | ToolResponseContent;
  created_at: string;
}

export interface ToolCallContent {
  type: 'tool_call';
  tool_name: string;
  tool_call_id: string;
  api_id: string;
  parameters: Record<string, any>;
  token_count: number;
}

export interface AssistantContent {
  type: 'assistant';
  content: string;
  tool_calls: ToolCallContent[];
  token_count: number;
}

export interface PDFContent {
  type: 'pdf';
  file_name: string;
  media_type: string;
  data: string;  // base64 encoded content
}

export interface UserContent {
  type: 'user';
  content: string | Array<string | PDFContent>;
  token_count: number;
}


export interface ToolResponseContent {
  type: 'tool_response',
  token_count: number;
  tool_call_id: string;
  api_id: string;
  response: Record<string, any> | string;
}

export interface ToolResponse {
  tool: string;
  tool_input: any;
  log?: string;
  type?: string;
  message_log?: any[];
  tool_call_id?: string;
}

export interface SendMessageRequest {
  content: string;
  agentCallVariables?: Record<string, Record<string, string>>;
  agentCallHeaders?: Record<string, Record<string, string>>;
  pdf_data?: PDFContent[];
}