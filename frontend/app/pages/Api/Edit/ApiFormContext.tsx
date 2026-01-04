// ApiFormContext.tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Api } from '~/pages/Api/common/api-type';
import type { NestedApiProperty } from '../common/nested-api-property';
import { convertToNestedProperties } from './utils/apiUtils';

export interface KeyValuePair {
    key: string;
    value: string | null | undefined;
}

interface ApiFormContextType {
    // Basic info
    name: string;
    setName: (value: string) => void;
    description: string;
    setDescription: (value: string) => void;
    method: string;
    setMethod: (value: string) => void;
    url: string;
    setUrl: (value: string) => void;

    // Properties
    properties: NestedApiProperty[];
    setProperties: (value: NestedApiProperty[]) => void;
    addProperty: (parentPath?: number[]) => void;
    updateProperty: (path: number[], field: keyof NestedApiProperty, value: any) => void;
    removeProperty: (path: number[]) => void;

    // Variables
    variables: KeyValuePair[];
    setVariables: (value: KeyValuePair[]) => void;
    addVariable: () => void;
    updateVariable: (index: number, field: 'key' | 'value', value: string) => void;
    removeVariable: (index: number) => void;

    // Headers
    headers: KeyValuePair[];
    setHeaders: (value: KeyValuePair[]) => void;
    addHeader: () => void;
    updateHeader: (index: number, field: 'key' | 'value', value: string) => void;
    removeHeader: (index: number) => void;

    // Path Variables
    pathVariables: KeyValuePair[];
    setPathVariables: (value: KeyValuePair[]) => void;
    addPathVariable: () => void;
    updatePathVariable: (index: number, field: 'key' | 'value', value: string) => void;
    removePathVariable: (index: number) => void;

    // Response Hidden Fields
    responseHiddenFields: string[];
    setResponseHiddenFields: (value: string[]) => void;
    addResponseHiddenField: () => void;
    updateResponseHiddenField: (index: number, value: string) => void;
    removeResponseHiddenField: (index: number) => void;
}

const ApiFormContext = createContext<ApiFormContextType | undefined>(undefined);

interface ApiFormProviderProps {
    children: ReactNode;
    initialData?: Api;
}

export function ApiFormProvider({ children, initialData }: ApiFormProviderProps) {
    // Basic Information
    const [name, setName] = useState(initialData?.tool_description.name || '');
    const [method, setMethod] = useState(initialData?.method || 'get');
    const [url, setUrl] = useState(initialData?.url || '');
    const [description, setDescription] = useState(initialData?.tool_description.description || '');

    // Properties
    const [properties, setProperties] = useState<NestedApiProperty[]>([]);

    // Variables
    const [variables, setVariables] = useState<KeyValuePair[]>([]);

    // Headers
    const [headers, setHeaders] = useState<KeyValuePair[]>([]);

    // Path Variables
    const [pathVariables, setPathVariables] = useState<KeyValuePair[]>([]);

    // Response Hidden Fields
    const [responseHiddenFields, setResponseHiddenFields] = useState<string[]>([]);

    // Initialize from initialData
    useEffect(() => {
        if (initialData?.tool_description.input_schema?.properties) {
            const props = convertToNestedProperties(
                initialData.tool_description.input_schema.properties,
                initialData.tool_description.input_schema.required || []
            );
            setProperties(props);
        } else {
            setProperties([{ name: '', type: 'string', required: false }]);
        }

        if (initialData?.variables && Object.keys(initialData.variables).length > 0) {
            const variableArray: KeyValuePair[] = Object.entries(initialData.variables).map(([key, value]) => ({
                key,
                value: value || ''
            }));
            setVariables(variableArray);
        } else {
            setVariables([{ key: '', value: '' }]);
        }

        if (initialData?.headers && Object.keys(initialData.headers).length > 0) {
            const headerArray: KeyValuePair[] = Object.entries(initialData.headers).map(([key, value]) => ({
                key,
                value: value || ''
            }));
            setHeaders(headerArray);
        } else {
            setHeaders([{ key: '', value: '' }]);
        }

        if (initialData?.path_variables && Object.keys(initialData.path_variables).length > 0) {
            const pathVarArray: KeyValuePair[] = Object.entries(initialData.path_variables).map(([key, value]) => ({
                key,
                value: value || ''
            }));
            setPathVariables(pathVarArray);
        } else {
            setPathVariables([{ key: '', value: '' }]);
        }

        if (initialData?.response_hidden_fields) {
            setResponseHiddenFields(
                initialData.response_hidden_fields.length > 0 ? initialData.response_hidden_fields : ['']
            );
        } else {
            setResponseHiddenFields(['']);
        }
    }, [initialData]);

    // Property functions
    const addProperty = (parentPath: number[] = []) => {
        const newProperty: NestedApiProperty = { name: '', type: 'string', required: false };

        if (parentPath.length === 0) {
            setProperties([...properties, newProperty]);
        } else {
            const updated = [...properties];
            let current = updated;

            for (let i = 0; i < parentPath.length - 1; i++) {
                current = current[parentPath[i]].properties!;
            }

            const parent = current[parentPath[parentPath.length - 1]];
            if (!parent.properties) {
                parent.properties = [];
            }
            parent.properties.push(newProperty);

            setProperties(updated);
        }
    };

    const updateProperty = (path: number[], field: keyof NestedApiProperty, value: any) => {
        const updated = [...properties];
        let current = updated;

        for (let i = 0; i < path.length - 1; i++) {
            current = current[path[i]].properties!;
        }

        const property = current[path[path.length - 1]];

        if (field === 'type' && property.type === 'object' && value !== 'object') {
            delete property.properties;
        } else if (field === 'type' && value === 'object' && !property.properties) {
            property.properties = [{ name: '', type: 'string', required: false }];
        }

        (property as any)[field] = value;

        setProperties(updated);
    };

    const removeProperty = (path: number[]) => {
        if (path.length === 1 && properties.length === 1) {
            setProperties([{ name: '', type: 'string', required: false }]);
        }

        const updated = [...properties];

        if (path.length === 1) {
            updated.splice(path[0], 1);
        } else {
            let current = updated;
            for (let i = 0; i < path.length - 1; i++) {
                current = current[path[i]].properties!;
            }
            current.splice(path[path.length - 1], 1);
        }

        setProperties(updated);
    };

    // Variable functions
    const addVariable = () => {
        setVariables([...variables, { key: '', value: '' }]);
    };

    const updateVariable = (index: number, field: 'key' | 'value', value: string) => {
        const updated = [...variables];
        updated[index] = { ...updated[index], [field]: value };
        setVariables(updated);
    };

    const removeVariable = (index: number) => {
        if (variables.length === 1) {
            setVariables([{ key: '', value: '' }]);
        } else {
            setVariables(variables.filter((_, i) => i !== index));
        }
    };

    // Header functions
    const addHeader = () => {
        setHeaders([...headers, { key: '', value: '' }]);
    };

    const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
        const updated = [...headers];
        updated[index] = { ...updated[index], [field]: value };
        setHeaders(updated);
    };

    const removeHeader = (index: number) => {
        if (headers.length === 1) {
            setHeaders([{ key: '', value: '' }]);
        } else {
            setHeaders(headers.filter((_, i) => i !== index));
        }
    };

    // Path Variable functions
    const addPathVariable = () => {
        setPathVariables([...pathVariables, { key: '', value: '' }]);
    };

    const updatePathVariable = (index: number, field: 'key' | 'value', value: string) => {
        const updated = [...pathVariables];
        updated[index] = { ...updated[index], [field]: value };
        setPathVariables(updated);
    };

    const removePathVariable = (index: number) => {
        if (pathVariables.length === 1) {
            setPathVariables([{ key: '', value: '' }]);
        } else {
            setPathVariables(pathVariables.filter((_, i) => i !== index));
        }
    };

    // Response Hidden Field functions
    const addResponseHiddenField = () => {
        setResponseHiddenFields([...responseHiddenFields, '']);
    };

    const updateResponseHiddenField = (index: number, value: string) => {
        const updated = [...responseHiddenFields];
        updated[index] = value;
        setResponseHiddenFields(updated);
    };

    const removeResponseHiddenField = (index: number) => {
        if (responseHiddenFields.length === 1) {
            setResponseHiddenFields(['']);
        } else {
            setResponseHiddenFields(responseHiddenFields.filter((_, i) => i !== index));
        }
    };

    const value: ApiFormContextType = {
        name,
        setName,
        description,
        setDescription,
        method,
        setMethod,
        url,
        setUrl,
        properties,
        setProperties,
        addProperty,
        updateProperty,
        removeProperty,
        variables,
        setVariables,
        addVariable,
        updateVariable,
        removeVariable,
        headers,
        setHeaders,
        addHeader,
        updateHeader,
        removeHeader,
        pathVariables,
        setPathVariables,
        addPathVariable,
        updatePathVariable,
        removePathVariable,
        responseHiddenFields,
        setResponseHiddenFields,
        addResponseHiddenField,
        updateResponseHiddenField,
        removeResponseHiddenField,
    };

    return <ApiFormContext.Provider value={value}>{children}</ApiFormContext.Provider>;
}

export function useApiFormContext() {
    const context = useContext(ApiFormContext);
    if (context === undefined) {
        throw new Error('useApiFormContext must be used within an ApiFormProvider');
    }
    return context;
}