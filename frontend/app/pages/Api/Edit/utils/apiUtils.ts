import type { ApiTool, UpdateApiRequest } from "../../common/api-type";
import type { NestedApiProperty } from "../../common/nested-api-property";
import type { KeyValuePair } from "../ApiFormContext";

export function prepareApiFormRequest(name: string,
    description: string,
    method: string,
    url: string,
    properties: NestedApiProperty[],
    variables: KeyValuePair[],
    headers: KeyValuePair[],
    pathVariables: KeyValuePair[],
    responseHiddenFields: string[]
): UpdateApiRequest {

    const schema = convertPropertiesToSchema(properties);

    const apiTool: ApiTool = {
        name,
        description,
        input_schema: {
            type: 'object',
            properties: schema.properties,
            required: schema.required,
        },
    };

    const filteredResponseHiddenFields = responseHiddenFields.filter(value => isValid(value));

    const variableObject = variables.reduce((acc, { key, value }) => {
        if (isValid(key) && isValid(value)) {
            acc[key] = value;
        }
        return acc;
    }, {} as Record<string, string | null | undefined>);

    const pathVariableObject = pathVariables.reduce((acc, { key, value }) => {
        if (isValid(key) && isValid(value)) {
            acc[key] = value;
        }
        return acc;
    }, {} as Record<string, string | null | undefined>);

    const headersObject = headers.reduce((acc, { key, value }) => {
        if (isValid(key) && isValid(value)) {
            acc[key] = value;
        }
        return acc;
    }, {} as Record<string, string | null | undefined>);


    return {
        tool_description: apiTool,
        method: method,
        url: url,
        variables: variableObject,
        headers: headersObject,
        response_hidden_fields: filteredResponseHiddenFields,
        path_variables: pathVariableObject,
        active: true
    } as UpdateApiRequest;
};

import type { ApiProperty } from '~/pages/Api/common/api-type';

/**
 * Converts API schema properties to nested properties format for form editing
 */
export function convertToNestedProperties(
    schemaProps: any,
    requiredFields: string[] = []
): NestedApiProperty[] {
    return Object.entries(schemaProps).map(([key, value]: [string, any]) => {
        const property: NestedApiProperty = {
            name: key,
            type: value.type as ApiProperty['type'],
            predefined_variable_name: value.predefined_variable_name,
            description: value.description,
            required: requiredFields.includes(key),
        };

        // If it's an object type with properties, recursively convert them
        if (value.type === 'object' && value.properties) {
            property.properties = convertToNestedProperties(
                value.properties,
                value.required || []
            );
        }

        return property;
    });
}

/**
 * Converts nested properties back to API schema format
 */
export function convertPropertiesToSchema(props: NestedApiProperty[]): {
    properties: Record<string, any>;
    required: string[];
} {
    const propertiesObject: Record<string, any> = {};
    const requiredFields: string[] = [];

    props.forEach(prop => {
        if (isValid(prop.name)) {
            const propSchema: any = {
                type: prop.type,
                ...(prop.description && { description: prop.description }),
                ...(prop.predefined_variable_name && { predefined_variable_name: prop.predefined_variable_name }),
            };

            // If it's an object with nested properties
            if (prop.type === 'object' && prop.properties && prop.properties.length > 0) {
                const nested = convertPropertiesToSchema(prop.properties);
                propSchema.properties = nested.properties;
                if (nested.required.length > 0) {
                    propSchema.required = nested.required;
                }
            }

            propertiesObject[prop.name] = propSchema;

            if (prop.required) {
                requiredFields.push(prop.name);
            }
        }
    });

    return { properties: propertiesObject, required: requiredFields };
}

function isValid(value?: string | null): boolean {
    return value !== undefined && value !== null && value.trim() !== '';
}