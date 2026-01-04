import type { Api } from "../../Api/common/api-type";

export interface Agent {
  id: string;
  name: string;
  description: string;
  temperature: number,
  api_models: Api[];
  model_provider: string;
  model_name: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateAgentRequest {
  name: string;
  description: string;
  temperature: number,
  api_ids?: string[];
  model_provider: string;
  model_name: string;
}

export interface UpdateAgentRequest {
  name?: string;
  description?: string;
  temperature?: number,
  api_ids?: string[];
  model_provider: string;
  model_name: string;
}