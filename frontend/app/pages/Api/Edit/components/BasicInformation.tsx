// BasicInformation.tsx
import DropDown from '~/components/DropDown';
import InputField from '~/components/InputField';
import TextArea from '~/components/TextArea';
import { useApiFormContext } from '../ApiFormContext';
import SectionHeader from '../common/SectionHeader';

export default function BasicInformation() {
  const {
    name,
    setName,
    description,
    setDescription,
    method,
    setMethod,
    url,
    setUrl,
  } = useApiFormContext();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
      <div className="mb-4">
        <SectionHeader
          label='Basic Information'
          description='Configure the core details of your API endpoint'
        />
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label='Tool Name'
            value={name}
            onChange={setName}
            required={true}
            extraDescription='No white spaces allowed'
          />

          <DropDown
            label='Method'
            options={new Map<string, string>([
              ["get", "GET"],
              ["post", "POST"],
              ["put", "PUT"],
              ["delete", "DELETE"]
            ])}
            value={method}
            onChange={setMethod}
            extraDescription='HTTP method for the request'
          />
        </div>

        <InputField
          label='API Endpoint URL'
          value={url}
          placeholder="https://api.example.com/endpoint/{id}"
          onChange={setUrl}
          required={true}
          extraDescription='Include path variables with {variable_name}'
        />

        <TextArea
          label="Description"
          value={description}
          placeholder="Describe what this tool does..."
          onChange={setDescription}
          required={true}
        />
      </div>
    </div>
  );
}