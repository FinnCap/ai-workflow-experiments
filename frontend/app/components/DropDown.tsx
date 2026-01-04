interface DropDownProps {
    label: string;
    value: string;
    options: Map<string, string>;
    onChange: (value: string) => void;
    extraDescription?: string;
}

export default function DropDown({ label, value, options, onChange, extraDescription }: DropDownProps) {

    return <div>
        <label className={`block text-sm font-medium text-gray-800 ${!extraDescription ? 'mb-1' : ''}`}>
            {label}
        </label>
        {extraDescription && <p className="mt-1 text-xs text-gray-500 mb-1">{extraDescription}</p>}
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full pl-3 py-2 pr-10 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
            {[...options].map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
            ))}
        </select>
    </div >

} 