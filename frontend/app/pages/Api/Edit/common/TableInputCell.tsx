interface TableInputCellProps {
    value: string;
    index: number;
    type: 'key' | 'value';
    onUpdate: (index: number, type: 'key' | 'value', newValue: string) => void;
    placeholder: string
}

export default function TableInputCell({ value, index, type, onUpdate, placeholder }: TableInputCellProps) {

    return <div className="bg-white">
        <input
            type="text"
            value={value}
            onChange={(e) => onUpdate(index, type, e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-3 text-sm border-0 bg-transparent focus:outline-none focus:bg-blue-50 rounded-none"
        />
    </div>
}