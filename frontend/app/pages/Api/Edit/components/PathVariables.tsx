import { Plus } from 'lucide-react';
import PrimaryBtn from '~/components/PrimaryBtn';
import { useApiFormContext } from '../ApiFormContext';
import SectionHeader from '../common/SectionHeader';
import TwoColumnTable from '../common/TwoColumnTable';

export default function PathVariable() {
  const { pathVariables, addPathVariable, updatePathVariable, removePathVariable } = useApiFormContext();

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <SectionHeader label='Path Variables' description='Variables that replace placeholders in the URL path' />
        <PrimaryBtn label='Path Variable' onClick={addPathVariable} icon={Plus} />
      </div>

      <TwoColumnTable
        values={pathVariables}
        placeholderKey="user_id"
        placeholderValue="User identifier"
        onUpdate={updatePathVariable}
        onRemove={removePathVariable}
      />
    </div>
  );
}