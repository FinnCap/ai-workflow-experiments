
import type { KeyValuePair } from "../ApiFormContext";
import TableInputCell from "./TableInputCell";
import TableRowDelete from "./TableRowDelete";

interface TwoColumnTableProps {
    values: KeyValuePair[];
    placeholderKey: string;
    placeholderValue: string;
    onUpdate: (index: number, field: "key" | "value", value: string) => void;
    onRemove: (index: number) => void;
}

export default function TwoColumnTable({ values, placeholderKey, placeholderValue, onUpdate, onRemove }: TwoColumnTableProps) {

    return <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="grid grid-cols-2 gap-px bg-gray-200 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 border-b border-gray-200">
            <div>Name</div>
            <div>Value</div>
        </div>
        {values.map((value, index) => (
            <div key={index} className="flex items-center bg-white hover:bg-white transition-colors">
                <div className="flex-1 grid grid-cols-2 gap-px bg-gray-200">
                    <TableInputCell
                        value={value.key || ''}
                        index={index}
                        type='key'
                        onUpdate={onUpdate}
                        placeholder={placeholderKey}
                    />

                    <TableInputCell
                        value={value.value || ''}
                        index={index}
                        type='value'
                        onUpdate={onUpdate}
                        placeholder={placeholderValue}
                    />
                </div>
                <TableRowDelete index={index} onDelete={onRemove} />
            </div>
        ))}
    </div>
}