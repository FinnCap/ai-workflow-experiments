import { Plus } from 'lucide-react';
import PrimaryBtn from '~/components/PrimaryBtn';
import { useApiFormContext } from '../ApiFormContext';
import SectionHeader from '../common/SectionHeader';
import TwoColumnTable from '../common/TwoColumnTable';

export default function Headers() {
  const { headers, addHeader, updateHeader, removeHeader } = useApiFormContext();

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <SectionHeader label='Headers' description='HTTP headers included with every request' />
        <PrimaryBtn label='Header' onClick={addHeader} icon={Plus} />
      </div>

      <TwoColumnTable
        values={headers}
        placeholderKey="Authorization"
        placeholderValue="Bearer token123"
        onUpdate={updateHeader}
        onRemove={removeHeader}
      />
    </div>
  );
}