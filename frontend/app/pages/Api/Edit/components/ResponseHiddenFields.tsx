// ResponseHiddenFields.tsx
import { Plus } from 'lucide-react';
import PrimaryBtn from '~/components/PrimaryBtn';
import { useApiFormContext } from '../ApiFormContext';
import OneColumnTable from '../common/OneColumnTable';
import SectionHeader from '../common/SectionHeader';

export default function ResponseHiddenFields() {
  const {
    responseHiddenFields,
    addResponseHiddenField,
    updateResponseHiddenField,
    removeResponseHiddenField
  } = useApiFormContext();

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <SectionHeader label='Response Hidden Fields' description='Fields to filter out from API responses' />
        <PrimaryBtn label='Field' onClick={addResponseHiddenField} icon={Plus} />
      </div>

      <OneColumnTable
        values={responseHiddenFields}
        placeholder={'password, internal_id'}
        onUpdate={updateResponseHiddenField}
        onRemove={removeResponseHiddenField}
      />
    </div>
  );
}
