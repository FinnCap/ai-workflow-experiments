import { type Message } from "~/pages/Chat/common/message-type";

export interface Chat {
  id: string;
  agent_id?: string;
  source: string;
  title?: string;
  created_at: string;
  updated_at: string;
  message_count: number;
  messages?: Message[];
}

export interface CreateChatRequest {
  use_tools: boolean;
  agent_id?: string;
  title?: string;
}