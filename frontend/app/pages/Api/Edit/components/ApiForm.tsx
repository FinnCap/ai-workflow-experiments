// ApiForm.tsx
import { Plus, Save } from 'lucide-react';
import PrimaryBtn from '~/components/PrimaryBtn';
import SecondaryBtn from '~/components/SecondaryBtn';
import type { Api, UpdateApiRequest } from '~/pages/Api/common/api-type';
import BasicInformation from '~/pages/Api/Edit/components/BasicInformation';
import Headers from '~/pages/Api/Edit/components/Headers';
import PathVariable from '~/pages/Api/Edit/components/PathVariables';
import PropertyField from '~/pages/Api/Edit/components/properties/PropertyField';
import ResponseHiddenFields from '~/pages/Api/Edit/components/ResponseHiddenFields';
import Variables from '~/pages/Api/Edit/components/Variables';
import { ApiFormProvider, useApiFormContext } from '../ApiFormContext';
import SectionHeader from '../common/SectionHeader';
import { prepareApiFormRequest } from '../utils/apiUtils';

interface ApiFormProps {
    initialData?: Api;
    onSubmit: (data: UpdateApiRequest) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

function ApiFormContent({ onSubmit, onCancel, isLoading, initialData }: ApiFormProps) {
    const {
        name,
        description,
        method,
        url,
        properties,
        addProperty,
        updateProperty,
        removeProperty,
        variables,
        headers,
        pathVariables,
        responseHiddenFields,
    } = useApiFormContext();

    const handleSubmit = () => {
        const data = prepareApiFormRequest(
            name, description, method, url, properties, variables, headers, pathVariables, responseHiddenFields
        )
        onSubmit(data)
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <BasicInformation />
            <Variables />
            <Headers />
            <ResponseHiddenFields />
            <PathVariable />

            <div className="border-t border-gray-200 pt-12">
                <div className="space-y-6">

                    <div className="flex items-center justify-between mb-2">
                        <SectionHeader
                            label={method !== 'get' ? "Input Schema" : "Query Parameters"}
                            description='Define the input parameters that your tool will accept'
                        />
                        <PrimaryBtn label='Property' onClick={addProperty} icon={Plus} />
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <div className="grid grid-cols-24 gap-2 px-14 py-2 text-xs font-medium text-gray-600 border-b border-gray-200 mb-3">
                            <div className="col-span-6">Name</div>
                            <div className="col-span-3">Type</div>
                            <div className="col-span-4">Variable</div>
                            <div className="col-span-10">Description</div>
                            <div className="col-span-1">Required</div>
                        </div>

                        <PropertyField
                            props={properties}
                            onUpdateProperty={updateProperty}
                            onRemoveProperty={removeProperty}
                            onAddProperty={addProperty}
                            isGetRequest={method === 'get'}
                        />
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-2">
                <SecondaryBtn label='Cancel' onClick={onCancel} disabled={isLoading} />
                <PrimaryBtn label={isLoading ? 'Saving...' : initialData ? 'Update API' : 'Create API'} onClick={handleSubmit} icon={Save} disabled={isLoading} />
            </div>
        </form>
    );
}

// Main component wraps content with provider
export default function ApiForm(props: ApiFormProps) {
    return (
        <ApiFormProvider initialData={props.initialData}>
            <ApiFormContent {...props} />
        </ApiFormProvider>
    );
}