import { Plus } from 'lucide-react';
import PrimaryBtn from '~/components/PrimaryBtn';
import { useApiFormContext } from '../ApiFormContext';
import SectionHeader from '../common/SectionHeader';
import TwoColumnTable from '../common/TwoColumnTable';

export default function Variables() {
  const { variables, addVariable, updateVariable, removeVariable } = useApiFormContext();

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <SectionHeader label='Variables' description='Default parameters included with every API call' />
        <PrimaryBtn label='Variable' onClick={addVariable} icon={Plus} />
      </div>

      <TwoColumnTable
        values={variables}
        placeholderKey="parameter_name"
        placeholderValue="default_value"
        onUpdate={updateVariable}
        onRemove={removeVariable}
      />
    </div>
  );
}