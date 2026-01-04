
export interface ApiProperty {
  name: string;
  type: "string" | "number" | "boolean" | "object" | "array";
  predefined_variable_name?: string;
  description?: string;
  required: boolean;
}

export interface ApiTool {
  name: string;
  description: string;
  input_schema: {
    type: "object";
    properties: Record<string, ApiProperty>;
    required: string[];
  };
}

export interface Api {
  id: string;
  tool_description: ApiTool;
  variables: Record<string, string | null | undefined>;
  headers: Record<string, string | null | undefined>;
  response_hidden_fields: string[];
  path_variables: Record<string, string>;
  active: boolean;
  method: string;
  url: string;
  created_at: string;
  updated_at: string;
}

export interface CreateApiRequest {
  tool_description: ApiTool;
  variables: Record<string, string | null | undefined>
  headers: Record<string, string | null | undefined>
  path_variables: Record<string, string>;
  response_hidden_fields: string[]
  method: string;
  url: string;
  active?: boolean;
}

export interface UpdateApiRequest {
  tool_description: ApiTool;
  variables: Record<string, string | null | undefined>
  headers: Record<string, string | null | undefined>
  path_variables: Record<string, string>;
  response_hidden_fields: string[]
  method: string;
  url: string;
  active?: boolean;
}