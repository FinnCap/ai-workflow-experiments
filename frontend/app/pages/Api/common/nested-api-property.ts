import type { ApiProperty } from "./api-type";

export interface NestedApiProperty {
    name: string;
    type: ApiProperty['type'];
    predefined_variable_name?: string;
    description?: string;
    required: boolean;
    properties?: NestedApiProperty[];
}